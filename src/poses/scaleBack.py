import json

# Define the input and output file paths
input_file = "/Users/giacomosanguin/Documents/poseRoyale/pose-royale/src/poses/inclineLeft_scaled.json"
output_file = "/Users/giacomosanguin/Documents/poseRoyale/pose-royale/src/poses/InclineLeft.json"

# Define the width and height values
width = 640
height = 480

# Load the input JSON file
with open(input_file, "r") as f:
  data = json.load(f)

for pose in data:
  for coord, dim in zip(["x", "y"], [width, height]):
    data[pose][coord] /= dim


# Save the updated JSON file to a new file
with open(output_file, "w") as f:
  json.dump(data, f)
