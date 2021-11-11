import argparse
import requests
import eyed3
import json
import os
import re
from urllib.request import urlopen

SPOTIFY_CLIENT_ID = 'ca1b674cf18b42918494dc988fb4e670'
SPOTIFY_SECRET = 'e2da1269c7664b16825c4991d882d521'

SPOTIFY_TOKEN = ''

ALLOW_REFRESH = True

DATA_DIR = '/Volumes/ESD-USB/DJ Music Files'
# DATA_DIR = './'

def refresh_access_token():
	if(not ALLOW_REFRESH):
		return
	AUTH_URL = 'https://accounts.spotify.com/api/token'

	# POST
	auth_response = requests.post(AUTH_URL, {
	    'grant_type': 'client_credentials',
	    'client_id': SPOTIFY_CLIENT_ID,
	    'client_secret': SPOTIFY_SECRET,
	})

	# convert the response to JSON
	auth_response_data = auth_response.json()

	# save the access token
	access_token = auth_response_data['access_token']
	global SPOTIFY_TOKEN
	SPOTIFY_TOKEN = access_token
	with open('previous.token','w') as f:
		f.write(access_token)



def get_tracks_from_playlist_url(shared_url):

	"""
	to get a token manually
	https://developer.spotify.com/console/get-playlist-tracks/?playlist_id=&market=&fields=&limit=&offset=&additional_types=
	"""

	def parse_tracks_from_response(data):
		track_list = []
		for track in data['items']:

			num_secs = track['track']['duration_ms']/1000
			track_list.append(
				{'name':track['track']['name'],
				'artists':[x['name'] for x in track['track']['artists']],
				'coverArtUrl':track['track']['album']['images'][0]['url'],
				'album':track['track']['album']['name'],
				'duration':f"{int(num_secs//60)}:{int(num_secs%60)}"
				}
			)
		return track_list

	headers = {
	'Accept': 'application/json',
	'Content-Type': 'application/json',
	'Authorization': f'Bearer {SPOTIFY_TOKEN}'
	}

	playlist_id = shared_url.split('/')[-1]
	next_link = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks?limit=100"

	failed_attempts = 0
	master_track_list = []
	while(next_link is not None):
		response = requests.request("GET", next_link, headers=headers)
		if(not response.ok):
			if(failed_attempts >0):
				print('failed_attempts')
				print(response.text)
				exit(1)
			failed_attempts +=1
			# refresh_access_token()
			continue

		data = json.loads(response.text)
		# json.dump(data,open('test.json','w'))

		if('tracks' in data):
			data = data['tracks']
		next_link = data['next']
		master_track_list += parse_tracks_from_response(data)
	total_tracks = data['total']
	assert(len(master_track_list) == total_tracks)


	
	return master_track_list



	"""
	* - * Remix
	* - VIP
	* Radio Mix
	* (feat. *)

	"""

def verified_integer_input(lower_bound, upper_bound):
	choice = None
	while(not isinstance(choice, int) or choice <lower_bound or choice > upper_bound):
		try:
			choice = int(input('selection: '))
		except:
			pass
	return choice

def search_on_mp3_juices(track_obj):
	name = track_obj['name']
	artists = track_obj['artists']

	

	search_content = '%20'.join(name.split(' ')+[artists[0].replace('ø','o'),'extended'])
	search_content = search_content.replace('/','')

	url = f"https://mp3-juice.com/api.php?q={search_content}"

	headers = {
	'sec-ch-ua': '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
	'Accept': '*/*',
	'Referer': 'https://mp3-juice.com/mp3juices',
	'X-Requested-With': 'XMLHttpRequest',
	'sec-ch-ua-mobile': '?0',
	'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
	'sec-ch-ua-platform': '"macOS"'
	}

	response = requests.request("GET", url, headers=headers)
	response = json.loads(response.text)

	extended_mix_pick = None
	youtube_music_pick = None
	regular_pick = None
	print()
	print('Choices:')
	for i,youtube_item in enumerate(response['items']):
		try:
			view_count = int(youtube_item['viewCount'])
			view_count = f'{view_count/1e6:.2f}M' if view_count>1e6 else f'{view_count//1e3:.0f}K'
		except:
			view_count = youtube_item['viewCount']
		print(f"\t{i+1}) ({youtube_item['duration']}) {view_count} views\t{youtube_item['title']} ({i+1})")


		# if the title matches exactly with no artist then the first match is the youtube music pick
		if(youtube_music_pick is None and name == youtube_item['title']):
			youtube_music_pick = (i+1,youtube_item)

		# if the title and artist matches excluding case and there exists 'extended mix' then the first match is the extended pick
		if(extended_mix_pick is None and name.lower() in youtube_item['title'].lower() and artists[0].lower() in youtube_item['title'].lower() and 'extended mix' in youtube_item['title'].lower()):
			extended_mix_pick = (i+1,youtube_item)

		# if the result title minus the song name and artists contains no further letters then the firs result is the regular pick

		yt_track_title = youtube_item['title'].lower()
		for x in [a.lower() for a in artists] + [name.lower()]:
			yt_track_title = yt_track_title.replace(x,'')

		if(regular_pick is None and re.match(r'^\W+$', yt_track_title)):
			regular_pick = (i+1,youtube_item)


	print()
	if(regular_pick or youtube_music_pick or extended_mix_pick):
		print('Suggestions:')
	if(regular_pick):
		print(f'ordinary:\t{regular_pick[0]}) {regular_pick[1]["title"]}')
	if(youtube_music_pick):
		print(f'yt music:\t{youtube_music_pick[0]}) {youtube_music_pick[1]["title"]}')
	if(extended_mix_pick):
		print(f'extended:\t{extended_mix_pick[0]}) {extended_mix_pick[1]["title"]}')
	if(regular_pick or youtube_music_pick or extended_mix_pick):
		print()

	choice = verified_integer_input(1, len(response['items']))


	return response['items'][choice-1]

def parse_song_name(track_obj):
	name = track_obj['name']
	artists = track_obj['artists']

	# make all lower case
	name = name.lower()
	# delete artists
	for a in artists:
		name = name.replace(a.lower(),'')
	# delete other words
	to_delete =\
	[
		'ft',
		'feat',
		'remix',
		'extended',
		'monstercat',
	]
	for word in to_delete:
		name = name.replace(word.lower(),'')
	name=name.replace('  ',' ')
	# remove any non letter character
	regex = re.compile('[^a-zA-Z\s]')
	name = regex.sub('', name)
	# bring back to title form
	name = name.title()
	# strip any leftover spaces
	name = name.strip()
	name = name.replace('  ',' ')

	return name

def configure_filename(track_obj, youtube_name):
	name = track_obj['name']
	artists = track_obj['artists']

	extended = ' (Extended Mix)' if 'extended' in youtube_name.lower() else ''
	remix = f' ({artists[-1].strip()} Remix)' if 'remix' in name.lower() else ''

	name = parse_song_name(track_obj)

	new_name = f'{artists[0]} - {name}{remix}{extended}'

	print()
	print('Please select the better filename:')
	print(f'\t1) Youtube Title:\t{youtube_name}')
	print(f'\t2) Suggested Title:\t{new_name}')
	print()
	choice = verified_integer_input(1, 2)
	if(choice == 1):
		return youtube_name
	if(choice == 2):
		return new_name

	print('verified int func failed')
	exit(1)



def download_youtube_link(youtube_link, track_obj):
	video_id = youtube_link.split('v=')[-1]
	url = f"https://api.mp3yt.link/api/json/mp3/{video_id}"

	headers = {
	  'authority': 'api.mp3yt.link',
	  'sec-ch-ua': '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
	  'accept': '*/*',
	  'sec-ch-ua-mobile': '?0',
	  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
	  'sec-ch-ua-platform': '"macOS"',
	  'origin': 'https://mp3-juice.com',
	  'sec-fetch-site': 'cross-site',
	  'sec-fetch-mode': 'cors',
	  'sec-fetch-dest': 'empty',
	  'referer': 'https://mp3-juice.com/',
	  'accept-language': 'en-US,en;q=0.9'
	}

	response = requests.request("GET", url, headers=headers)

	response = json.loads(response.text)

	download_link = response['vidInfo'][0]
	assert(download_link['bitrate']==320)
	download_link = download_link['dloadUrl']
	# print(download_link)
	new_name = configure_filename(track_obj, response['vidTitle'])+'.mp3'
	download_mp3_file(download_link, new_name)
	return new_name

	# webbrowser.open(download_link)

def get_tracks_from_directory(dir):
	if(not os.path.isdir(dir)):
		print('invalid directory, plug in the flashdrive you trenchbox 🤬')
		exit(1)

	acceptable_extensions = ['.mp3','.m4a']
	filename_list = []
	for dirpath, dirnames, filenames in os.walk(dir):
		filenames = [f for f in filenames if '.'+f.split('.')[-1] in acceptable_extensions]
		for filename in filenames:
			filename_list.append(filename)
			# print(filename)
	return filename_list

def check_if_already_exists(track):
	name = track['name']
	artists = track['artists']
	filename_list = get_tracks_from_directory(DATA_DIR)
	for filename in filename_list:
		# distance = lev(track_title, filename)
		# ratio = distance/min(len(filename),len(track_title))
		# print(ratio)
		if(any(x in filename.lower() for x in parse_song_name(track).lower().split(' ')) and artists[0].lower() in filename.lower()):
			return True
	# print(f'dup not found, searched for {parse_song_name(track).lower()} or {artists[0].lower()} in music folder')
	return False

def download_mp3_file(remote_url, suggested_filename):
	print()
	print('Downloading...',end='')
	from urllib import request
	import ssl
	ssl._create_default_https_context = ssl._create_unverified_context
	request.urlretrieve(remote_url, os.path.join(DATA_DIR,suggested_filename.replace('/','')))
	print("\rDone!")

if __name__ == "__main__":

	# =======

	parser = argparse.ArgumentParser()
	parser.add_argument('-refresh','--refresh_access_token', action='store_true', required=False)
	args = parser.parse_args()

	if(args.refresh_access_token):
		refresh_access_token()
	else:
		with open('previous.token','r') as f:
			SPOTIFY_TOKEN = f.read()



	shared_url = "https://open.spotify.com/playlist/1Vnca95X4I15IvZPHBArcU?si=75f779967f984b60"

	# example_track = {
	# 	'name': 'For The Love Of Money',
	# 	'artists': ['MOTi','Michael Ford']
	# }


	track_list = get_tracks_from_playlist_url(shared_url)
	for track in track_list[:]:

		print("\n\n=====================================================")
		print('Up Next:')
		print(f'\t({track["duration"]}) {track["artists"][0]} - {track["name"]}')

		exists = check_if_already_exists(track)
		if(exists):
			print('Duplicate Found, Continuing...')
			print()
			continue
		try:
			youtube_item = search_on_mp3_juices(track)
		except:
			print(track)
			print('could not be found')
			input("press any key to continue...")
			continue
		# print(youtube_item)
		filename = download_youtube_link(youtube_item['url'], track)

		# add meta data
		audiofile = eyed3.load(os.path.join(DATA_DIR, filename))
		if (audiofile.tag == None):
			audiofile.initTag()
		audiofile.tag.artist = track["artists"][0]
		audiofile.tag.title = track['name']
		audiofile.tag.album = track['album']
		audiofile.tag.images.set(eyed3.id3.frames.ImageFrame.FRONT_COVER, urlopen(track['coverArtUrl']).read(), 'image/jpeg')
		audiofile.tag.save()



"""
when selecting youtube video, it is ok to switch from regular to extended but not from regular to a remix, the names will be off because name data is taken from spotify
"""
