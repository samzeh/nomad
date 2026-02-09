import requests
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_classic.chains import RetrievalQA
from pydantic import BaseModel, Field
from typing import List
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app =  FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in production, set your frontend URL
    allow_methods=["*"],
    allow_headers=["*"]
)


load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-lite",
    # model="gemini-2.5-flash",
    temperature=0.7,
    api_key=api_key
)

embeddings = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2"
)

vectorstore = FAISS.load_local(
  "vectorstore",
  embeddings,
  allow_dangerous_deserialization = True
)

class TravelRequest(BaseModel):
    budget: int
    start_date: str
    end_date: str
    interests: list[str]
    cultural_preferences: str
    home_location: str
  
class DayItinerary(BaseModel):
  day: int = Field(description="Day number of the trip")
  activities: list[str] = Field(description="List of activities planned for the day. Keep it short and concise")
  daily_budget: int = Field(description="Estimated budget for the day")

class TravelPlan(BaseModel):
  destination: str = Field(description="Travel destination: City, Country")
  reasoning: str = Field(description="Reason for choosing this destination. 1-2 setences")
  start_date: str = Field(description="Start date of the trip in ISO format: YYYY-MM-DD")
  end_date: str = Field(description="End date of the trip in ISO format: YYYY-MM-DD")
  duration: int = Field(description="Duration of the trip in days")
  total_budget: int = Field(description = "Total budget for the trip")
  estimated_cost: int = Field(description="Estimated total cost of the trip based on the activities planned, hotel accomadations, and transport costs")
  itinerary: list[DayItinerary] = Field(description="A day by day itinerary for the trip. Each day should have around 3 activities planned. Keep it short and concise")

parser = PydanticOutputParser(pydantic_object=TravelPlan)

prompt = PromptTemplate(
    template="""
    You are a travel planner. Your task is to create a travel plan for a trip based on the user's preferences. 
    Take into account the user's budget: {budget} CAD, trip length: {duration} days, travel date range: {date_range}, 
    and interests/hobbies: {interests}.

    Additionally, the user is travelling from: {home_location}. Thus, when generating the travel plan, ensure that the total estimated cost of the trip including transportation, accommodation, 
    and activities does not exceed the user budget of: {budget} CAD. You must take into account how much it costs to travel from {home_location} to your recommended destination. This needs to be factored into the total estimated cost of the trip, and you should adjust your destination recommendation accordingly to ensure that the total cost of the trip is within the user's budget.

    Additionally, use the following relevant information about potential travel destinations when creating a plan: {relevant_docs}. You do not need to use the information if it does not seem to align with the user's preferences, but you should use it as a reference when possible to create a more informed travel plan.

    {format_instructions}
    """,
    input_variables=["budget", "duration", "date_range", "interests", "relevant_docs", "home_location"],
    partial_variables={"format_instructions": parser.get_format_instructions()}
)

qa_chain = RetrievalQA.from_chain_type(
  llm=llm,
  chain_type="stuff",
  retriever=vectorstore.as_retriever(search_kwargs={"k": 5}),
  return_source_documents=True,
)

@app.post("/travel-plan", response_model=TravelPlan)
def generate_travel_plan(request: TravelRequest):

    user_inputs = request.dict()

    start_dt = datetime.fromisoformat(user_inputs["start_date"])
    end_dt = datetime.fromisoformat(user_inputs["end_date"])

    duration = (end_dt - start_dt).days + 1

    relevant_docs = []

    cultural_preference = user_inputs["cultural_preferences"]

    for interest in user_inputs["interests"]:
      query = f"Tell me about {interest} in the context of travelling to destinations in the vectorstore. Also try your best to provide results that align with the user's cultural preferences: {cultural_preference}."
      result = qa_chain.invoke({"query": query})
      relevant_docs.append(result["result"])

    
    response = llm.invoke(prompt.format(
      budget=user_inputs["budget"],
      duration=duration,
      date_range=f"{user_inputs['start_date']} - {user_inputs['end_date']}",
      interests=user_inputs["interests"],
      relevant_docs=relevant_docs,
      home_location=user_inputs["home_location"]
    ))

    travel_plan = parser.parse(response.content)

    return travel_plan