const API_URL = 'https://functions.poehali.dev/2a0aafed-f148-4d30-85d4-341738bfa04c';

export const api = {
  getStandings: () => fetch(`${API_URL}?endpoint=standings`).then(r => r.json()),
  getSchedule: () => fetch(`${API_URL}?endpoint=schedule`).then(r => r.json()),
  getRegulations: () => fetch(`${API_URL}?endpoint=regulations`).then(r => r.json()),
  
  getTeams: () => fetch(`${API_URL}?endpoint=admin/teams`).then(r => r.json()),
  updateTeam: (team: any) => fetch(`${API_URL}?endpoint=admin/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(team)
  }).then(r => r.json()),
  
  getMatches: () => fetch(`${API_URL}?endpoint=admin/matches`).then(r => r.json()),
  addMatch: (match: any) => fetch(`${API_URL}?endpoint=admin/matches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(match)
  }).then(r => r.json()),
  
  getAdminRegulations: () => fetch(`${API_URL}?endpoint=admin/regulations`).then(r => r.json()),
  addRegulation: (regulation: any) => fetch(`${API_URL}?endpoint=admin/regulations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(regulation)
  }).then(r => r.json()),
  updateRegulation: (regulation: any) => fetch(`${API_URL}?endpoint=admin/regulations`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(regulation)
  }).then(r => r.json()),
};
