import pandas as pd
import json

def create_json_object(row):
    # Assuming `row` contains conversation data structured similarly to the provided example.
    # This function should parse the conversation data from your CSV format into the specified JSON structure.
    # You might need to adjust the parsing logic based on the actual format of your CSV.
    
    # Placeholder logic for demonstration; replace with actual logic to extract and format conversation data
    messages = [
        {"role": "user", "content": row["user_message"]},  # Assuming a column named 'user_message' exists
        {"role": "assistant", "content": row["assistant_message"]}  # Assuming a column named 'assistant_message' exists
    ]
    
    return json.dumps({"messages": messages})

# Load the CSV; adjust 'file_path' to your CSV file location
file_path = 'train_10k.csv'
df = pd.read_csv(file_path, quoting=3, on_bad_lines='skip')

# Convert each row to the required JSON object format
json_objects = df.apply(create_json_object, axis=1)

# Output file path
output_file_path = 'conversations.jsonl'

# Write the JSON objects to a JSONL file
with open(output_file_path, 'w') as f:
    for json_object in json_objects:
        f.write(json_object + '\n')

print(f"File saved to {output_file_path}")
