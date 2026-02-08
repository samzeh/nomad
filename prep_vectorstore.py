import os
os.environ["USER_AGENT"] = "MyTravelBot/1.0 (contact: your_email@example.com)"

from dotenv import load_dotenv
load_dotenv()

from langchain_community.document_loaders import WebBaseLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings

from langchain_community.vectorstores import FAISS

# Load environment variables
load_dotenv()


WEBSITE_URLS = [
    "https://en.wikivoyage.org/wiki/France",
    "https://en.wikivoyage.org/wiki/Italy",
    "https://en.wikivoyage.org/wiki/Spain",
    "https://en.wikivoyage.org/wiki/Portugal",
    "https://en.wikivoyage.org/wiki/Switzerland",
    "https://en.wikivoyage.org/wiki/Greece",
    "https://en.wikivoyage.org/wiki/Japan",
    "https://en.wikivoyage.org/wiki/Thailand",
    "https://en.wikivoyage.org/wiki/Singapore",
    "https://en.wikivoyage.org/wiki/South_Korea",
    "https://en.wikivoyage.org/wiki/Philippines",
    "https://en.wikivoyage.org/wiki/United_States",
    "https://en.wikivoyage.org/wiki/Canada",
    "https://en.wikivoyage.org/wiki/Mexico",
    "https://en.wikivoyage.org/wiki/Brazil",
    "https://en.wikivoyage.org/wiki/Australia",
    "https://en.wikivoyage.org/wiki/Fiji",
    "https://en.wikivoyage.org/wiki/Egypt",
]

print(f"📥 Loading content from {len(WEBSITE_URLS)} URL(s)...")

# Load content from all websites
all_documents = []
for url in WEBSITE_URLS:
    try:
        print(f"  ⏳ Loading: {url}")
        loader = WebBaseLoader(url)
        docs = loader.load()

        # Add source URL to metadata for each document
        for doc in docs:
            doc.metadata["source_url"] = url

        all_documents.extend(docs)
        print(f"    ✅ Loaded {len(docs)} document(s) from {url}")
    except Exception as e:
        print(f"    ❌ Error loading {url}: {e}")
        print(f"       Skipping this URL and continuing...")

if not all_documents:
    print(
        "\n❌ No documents were loaded successfully. Please check your URLs and try again."
    )
    exit(1)

documents = all_documents
print(
    f"\n✅ Total: Loaded {len(documents)} document(s) from {len(WEBSITE_URLS)} URL(s)"
)

# Clean up whitespace from documents
import re

for doc in documents:
    # Replace multiple whitespace characters with a single space
    doc.page_content = re.sub(r"\s+", " ", doc.page_content).strip()

print("🧹 Cleaned up excess whitespace")

# ✨ TODO: Experiment with these values!
# chunk_size: How big each text chunk should be (500-2000 works well)
# chunk_overlap: How much chunks overlap (helps maintain context)
text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=200)

# Split the documents into chunks
chunks = text_splitter.split_documents(documents)
print(f"📄 Split into {len(chunks)} chunks")

# Create embeddings
print("🔮 Creating embeddings...")
embeddings = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2"
)
# Create and save the vectorstore
print("💾 Creating vectorstore...")
vectorstore = FAISS.from_documents(chunks, embeddings)
vectorstore.save_local("vectorstore")

print("🎉 Vectorstore created successfully!")
print("👉 Now run: streamlit run frontend.py")