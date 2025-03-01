// Exported models - removed TypeScript type annotations for plain JS
// These serve as documentation of the expected object shapes

// Player model
// {
//   id: string
//   name: string
//   photoUrl: string (optional)
// }

// Team model
// {
//   id: string
//   name: string
//   players: [player1, player2]
//   photoUrl: string (optional)
// }

// Tournament model
// {
//   id: string
//   name: string
//   teams: array of teams
//   matches: array of match results
//   startDate: string
//   endDate: string
//   status: one of 'upcoming', 'active', 'completed'
//   completed: boolean
//   grandFinalPlayed: boolean
//   createdAt: string
// }

// MatchResult model
// {
//   id: string
//   tournamentId: string (optional)
//   teamAId: string
//   teamBId: string
//   teamAScore: number
//   teamBScore: number
//   isGrandFinal: boolean (optional)
//   date: string
// }

// Match model (extends MatchResult)
// Same as MatchResult - can add additional fields if needed

// TeamStats model
// {
//   teamId: string
//   teamName: string
//   matchesPlayed: number
//   matchesWon: number
//   totalScore: number
//   rank: number
// }