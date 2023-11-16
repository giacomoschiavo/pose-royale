import json

# Define the input and output file paths
input_file = "D:\Progetti\pose-royale\src\poses\OPose.json"
output_file = "D:\Progetti\pose-royale\src\poses\OPose_scaled.json"

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