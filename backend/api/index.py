import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Main API for SHL website - standings, schedule, regulations, admin operations
    Args: event - dict with httpMethod, queryStringParameters, body
          context - object with request_id
    Returns: HTTP response with data based on endpoint
    '''
    method: str = event.get('httpMethod', 'GET')
    query_params = event.get('queryStringParameters', {}) or {}
    endpoint = query_params.get('endpoint', 'standings')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    if endpoint == 'standings' and method == 'GET':
        cur.execute('SELECT id, name FROM conferences ORDER BY id')
        conferences_rows = cur.fetchall()
        
        conferences = []
        for conf_row in conferences_rows:
            conf_id, conf_name = conf_row
            
            cur.execute('''
                SELECT id, name, games_played, wins, losses, overtime_losses, 
                       points, goals_for, goals_against, position
                FROM teams
                WHERE conference_id = %s
                ORDER BY position, points DESC
            ''', (conf_id,))
            
            teams_rows = cur.fetchall()
            teams = []
            for team_row in teams_rows:
                teams.append({
                    'id': team_row[0], 'name': team_row[1], 'games_played': team_row[2],
                    'wins': team_row[3], 'losses': team_row[4], 'overtime_losses': team_row[5],
                    'points': team_row[6], 'goals_for': team_row[7], 'goals_against': team_row[8],
                    'position': team_row[9]
                })
            
            conferences.append({'id': conf_id, 'name': conf_name, 'teams': teams})
        
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'conferences': conferences}),
            'isBase64Encoded': False
        }
    
    if endpoint == 'schedule' and method == 'GET':
        cur.execute('''
            SELECT m.id, ht.name as home_team, at.name as away_team,
                   m.match_date, m.home_score, m.away_score, m.status
            FROM matches m
            JOIN teams ht ON m.home_team_id = ht.id
            JOIN teams at ON m.away_team_id = at.id
            ORDER BY m.match_date DESC
        ''')
        
        matches_rows = cur.fetchall()
        matches = []
        for row in matches_rows:
            matches.append({
                'id': row[0], 'home_team': row[1], 'away_team': row[2],
                'match_date': row[3].isoformat() if row[3] else None,
                'home_score': row[4], 'away_score': row[5], 'status': row[6]
            })
        
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'matches': matches}),
            'isBase64Encoded': False
        }
    
    if endpoint == 'regulations' and method == 'GET':
        cur.execute('SELECT id, title, content, order_index FROM regulations ORDER BY order_index')
        regulations_rows = cur.fetchall()
        regulations = []
        for row in regulations_rows:
            regulations.append({'id': row[0], 'title': row[1], 'content': row[2], 'order_index': row[3]})
        
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'regulations': regulations}),
            'isBase64Encoded': False
        }
    
    if endpoint == 'admin/teams' and method == 'GET':
        cur.execute('''
            SELECT id, name, games_played, wins, losses, overtime_losses,
                   points, goals_for, goals_against, conference_id
            FROM teams ORDER BY conference_id, position
        ''')
        teams_rows = cur.fetchall()
        teams = []
        for row in teams_rows:
            teams.append({
                'id': row[0], 'name': row[1], 'games_played': row[2], 'wins': row[3],
                'losses': row[4], 'overtime_losses': row[5], 'points': row[6],
                'goals_for': row[7], 'goals_against': row[8], 'conference_id': row[9]
            })
        
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'teams': teams}),
            'isBase64Encoded': False
        }
    
    if endpoint == 'admin/teams' and method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        cur.execute('''
            UPDATE teams
            SET name = %s, games_played = %s, wins = %s, losses = %s,
                overtime_losses = %s, points = %s, goals_for = %s, goals_against = %s
            WHERE id = %s
        ''', (body_data.get('name'), body_data.get('games_played', 0), body_data.get('wins', 0),
              body_data.get('losses', 0), body_data.get('overtime_losses', 0), body_data.get('points', 0),
              body_data.get('goals_for', 0), body_data.get('goals_against', 0), body_data.get('id')))
        conn.commit()
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }
    
    if endpoint == 'admin/matches' and method == 'GET':
        cur.execute('''
            SELECT m.id, ht.name as home_team, at.name as away_team,
                   m.match_date, m.home_score, m.away_score, m.status
            FROM matches m
            JOIN teams ht ON m.home_team_id = ht.id
            JOIN teams at ON m.away_team_id = at.id
            ORDER BY m.match_date DESC
        ''')
        matches_rows = cur.fetchall()
        matches = []
        for row in matches_rows:
            matches.append({
                'id': row[0], 'home_team': row[1], 'away_team': row[2],
                'match_date': row[3].isoformat() if row[3] else None,
                'home_score': row[4], 'away_score': row[5], 'status': row[6]
            })
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'matches': matches}),
            'isBase64Encoded': False
        }
    
    if endpoint == 'admin/matches' and method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        cur.execute('''
            INSERT INTO matches (home_team_id, away_team_id, match_date, home_score, away_score, status)
            VALUES (%s, %s, %s, %s, %s, %s)
        ''', (body_data.get('home_team_id'), body_data.get('away_team_id'), body_data.get('match_date'),
              body_data.get('home_score'), body_data.get('away_score'), body_data.get('status', 'scheduled')))
        conn.commit()
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }
    
    if endpoint == 'admin/regulations' and method == 'GET':
        cur.execute('SELECT id, title, content, order_index FROM regulations ORDER BY order_index')
        regulations_rows = cur.fetchall()
        regulations = []
        for row in regulations_rows:
            regulations.append({'id': row[0], 'title': row[1], 'content': row[2], 'order_index': row[3]})
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'regulations': regulations}),
            'isBase64Encoded': False
        }
    
    if endpoint == 'admin/regulations' and method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        cur.execute('''
            INSERT INTO regulations (title, content, order_index)
            VALUES (%s, %s, %s)
        ''', (body_data.get('title'), body_data.get('content'), body_data.get('order_index', 0)))
        conn.commit()
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }
    
    if endpoint == 'admin/regulations' and method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        cur.execute('''
            UPDATE regulations
            SET title = %s, content = %s, order_index = %s
            WHERE id = %s
        ''', (body_data.get('title'), body_data.get('content'), body_data.get('order_index', 0), body_data.get('id')))
        conn.commit()
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }
    
    cur.close()
    conn.close()
    return {
        'statusCode': 404,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Endpoint not found'}),
        'isBase64Encoded': False
    }
