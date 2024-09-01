import requests

def get_updated_stats():
    url = 'http://127.0.0.1:5000/update_stats'  # URL of your Flask endpoint
    data = {
        'assessments': [
            {'assessment_type': 'summative', 'assignment_type': 'project'},
            {'assessment_type': 'formative', 'assignment_type': 'quiz'},
            # Add more assessments as needed
        ]
    }
    response = requests.post(url, json=data)
    if response.status_code == 200:
        return response.json()
    else:
        return None  # Handle error appropriately

def stats():
    updated_stats = get_updated_stats()
    if updated_stats:
        dmg1 = updated_stats['strength']
        dmg2 = updated_stats['strength'] + 2  # balance logic
        hp1 = updated_stats['health']
        hp2 = updated_stats['health'] + 5  # balance logic
        speed1 = updated_stats['speed']
        speed2 = updated_stats['speed'] + 4  # balance logic
        max_hp = hp1
        max_hp2 = hp2
        return [dmg1, dmg2, hp1, hp2, speed1, speed2, max_hp, max_hp2]
    else:
        # Fallback to default stats if something goes wrong
        return [5, 3, 10, 15, 8, 12, 10, 15]
