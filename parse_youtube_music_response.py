import json

data = json.load(open('example_youtube_music_response.json','r'))

print(len(data))
print(data.keys())
print(data['trackingParams'])