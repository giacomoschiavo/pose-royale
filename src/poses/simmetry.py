import json

# Define the input and output file paths
input_file = "/Users/giacomosanguin/Documents/poseroyal/pose-royale-1/src/poses/InclineRight_scaled.json"
output_file = "/Users/giacomosanguin/Documents/poseroyal/pose-royale-1/src/poses/inclineLeft_scaled.json"

# Define the width and height values
width = 640
height = 480

# Load the input JSON file
with open(input_file, "r") as f:
  data = json.load(f)

# Make the x-coordinates symmetric to the y-axis
for pose in data:
    data[pose]["x"] = width - data[pose]["x"]

# Save the updated JSON file to a new file
with open(output_file, "w") as f:
  json.dump(data, f)
