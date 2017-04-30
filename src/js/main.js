// Catch broken images before the dom loads
function imgError(image) {
	image.onerror = "";
	image.src = "https://bytesizemoments.com/wp-content/uploads/2014/04/placeholder.png";
	return true;
}
