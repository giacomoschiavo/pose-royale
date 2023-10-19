import json

# Define the input and output file paths
input_file = "tpose.json"
output_file = "tpose_scaled.json"

# Define the width and height values
width = 640
height = 480

# Load the input JSON file
with open(input_file, "r") as f:
  data = json.load(f)

# Multiply the x and y coordinates by width and height, respectively
for pose in data:
  for coord, dim in zip(["x", "y"], [width, height]):
    data[pose][coord] *= dim
    data[pose][coord] = int(data[pose][coord])

# Save the updated JSON file to a new file
with open(output_file, "w") as f:
  json.dump(data, f)
