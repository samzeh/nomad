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


load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
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

class DayItinerary(BaseModel):
  day: int = Field(description="Day number of the trip")
  activities: list[str] = Field(description="List of activities planned for the day. Keep it short and concise")
  daily_budget: int = Field(description="Estimated budget for the day")

class TravelPlan(BaseModel):
  destination: str = Field(description="Travel destination: City, Country")
  reasoning: str = Field(description="Reason for choosing this destination. 1-2 setences")
  duration: int = Field(description="Duration of the trip in days")
  total_budget: int = Field(description = "Total budget for the trip")
  estimated_cost: int = Field(description="Estimated total cost of the trip based on the activities planned, hotel accomadations, and transport costs")
  itinerary: list[DayItinerary] = Field(description="A day by day itinerary for the trip. Each day should have around 3 activities planned. Keep it short and concise")

parser = PydanticOutputParser(pydantic_object=TravelPlan)

prompt = PromptTemplate(
    template="""
    You are a travel planner. Your task is to create a travel plan for a trip based on the user's preferences. 
    Take into account the user's budget: {budget} CAD, trip length: {duration} days, travel month: {month}, 
    and interests/hobbies: {interests}. 

    When generating the travel plan, ensure that the total estimated cost of the trip including transportation, accommodation, 
    and activities does not exceed the user budget of: {budget} CAD. 

    Additionally, use the following relevant information about potential travel destinations when creating a plan: {relevant_docs}. You do not need to use the information if it does not seem to align with the user's preferences, but you should use it as a reference when possible to create a more informed travel plan.

    {format_instructions}
    """,
    input_variables=["budget", "duration", "month", "interests", "relevant_docs"],
    partial_variables={"format_instructions": parser.get_format_instructions()}
)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever(search_kwargs={"k": 5}),
    return_source_documents=True,
)

user_inputs = {
  "budget": 2000,
  "duration": 10,
  "month": "June",
  "interests": ["hiking", "food", "culture"] 
}

interests = user_inputs["interests"]
relevant_docs = []

for interest in interests:
   query = f"Tell me about {interest} in the context of travelling to destinations in the vectorstore"
   result = qa_chain.invoke({"query": query})
   relevant_docs.append(result["result"])


response = llm.invoke(prompt.format(
  budget = 2000,
  duration = 10,
  month = "June",
  interests = ["hiking", "food", "culture"],
  relevant_docs = relevant_docs
))

parsed_response = parser.parse(response.content)
print("structured response:")
print(f"destination: {parsed_response.destination}")
print(f"reasoning: {parsed_response.reasoning}")
print(f"duration: {parsed_response.duration} days")
print(f"total_budget: {parsed_response.total_budget} CAD")
print(f"estimated_cost: {parsed_response.estimated_cost} CAD")
print("itinerary:")
for day in parsed_response.itinerary:
  print(f"  Day {day.day}:")
  print(f"    activities: {', '.join(day.activities)}")
  print(f"    daily_budget: {day.daily_budget} CAD")  


