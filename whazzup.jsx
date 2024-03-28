async function getWhazzup() {
	const response = await fetch('https://api.ivao.aero/v2/tracker/whazzup');
	return await response.json();
}

function Body() {
	const [whazzup, setWhazzup] = React.useState({});

	React.useEffect(() => {
		const update = () => getWhazzup().then(data => {
			setWhazzup(data || whazzup);
		});
		setInterval(update, 15000);
		update();
	}, []);

	const allPilots =
		whazzup?.clients?.pilots
			?.filter(p => /^[KPT]/.test(p.flightPlan?.departureId) && /^[A-Z]{3,5}[0-9]\s/g.test(p.flightPlan?.route))
			?.sort((a, b) => a.callsign < b.callsign ? -1 : a.callsign > b.callsign ? 1 : 0);

	if (allPilots) {
		const apGroups = Object.groupBy(allPilots, p => p.flightPlan.departureId);
		console.log(Object.entries(apGroups));

		return <ul>{Object.entries(apGroups).map(([departure, pilots]) =>
			<li key={departure}>
				{departure}
				<ul>{
					pilots?.map(p =>
						<li key={p.callsign}>
							{p.callsign + " "}
							cleared to {p.flightPlan.arrivalId + " "}
							via the {p.flightPlan.route.split(/\s+/)[0]} departure, {p.flightPlan.route.split(/\s+/)[1]} transition, then as filed.
							On departure, climb via SID. Expect {p.flightPlan.level} 10 minutes after departure.
						</li>)
				}</ul>
			</li>)
		}</ul>;
	}
	else
		return <p>Error!</p>;
}

ReactDOM.createRoot(document.getElementById('app')).render(<Body />);