// Catch broken images before the dom loads
function imgError(image) {
	image.onerror = "";
	image.src = "/images/placeholder.png";
	return true;
}
