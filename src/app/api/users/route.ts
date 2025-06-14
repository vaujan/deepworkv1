export async function GET() {
	const users = [
		{
			name: "Fauzan",
			id: 1,
		},
		{
			name: "Jihan",
			id: 2,
		},
		{
			name: "Aldy",
			id: 3,
		},
	];

	return new Response(JSON.stringify(users), {
		status: 200,
		headers: { "Content-type": "application/json" },
	});
}

export async function POST(request: Request) {
	const body = await request.json();

	const { name } = body;

	const newUser = { id: Date.now(), name };

	return new Response(JSON.stringify(newUser), {
		status: 201,
		headers: { "Content-type": "application/json" },
	});
}
