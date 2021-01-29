export default function (palabra) {
	const palabraLower = palabra.toLowerCase();
	const listaPalabra = palabraLower.split("");
	const palabraReversed = listaPalabra.reverse().join("");
	return palabraLower === palabraReversed;
}
