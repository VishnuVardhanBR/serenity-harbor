# Serenity Harbor

## Backend Setup:

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment:

```bash
source venv/bin/activate
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

Create a `.env` file in the root directory with the following content:

```
OPENAI_API_KEY = <your_api_key_here>
FT_MODEL = <finetuned_model_id>
```

## Frontend Setup:

Install Node.js dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm start
```

