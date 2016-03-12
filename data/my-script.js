// "self" is a global object in content scripts
// Listen for a message, and replace the document's
// contents with the message payload.
self.port.on("replacePage", function(message) {
	alert('coucou');
  // On prend l'URL, et les inputs
	var page_url = document.URL ;
  // On les envoie au serveur
	var coll = document.getElementsByTagName('input');
	var names = [];
	for(var el of coll)
	  names.push( el.getAttribute('name') );
  // il nous dit ce qu'on doit y mettre
	var http = new XMLHttpRequest();
	var url = "http://192.168.1.82/add-on/names.php";
	var params = "url="+escape(encodeURI(url))+'&names='+escape(encodeURI(names.join(','))) ;
	http.open("POST", url, true);

	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.setRequestHeader("Content-length", params.length);
	http.setRequestHeader("Connection", "close");

	http.onreadystatechange = function() {//Call a function when the state changes.
	    if(http.readyState == 4 && http.status == 200) {
		alert(http.responseText);
		var response = JSON.parse(http.responseText);
		for(var el of names)													// pour tous les champs d'input
			if(response[el] != undefined)											// si on a ce champ dans le retour du serveur
				var inp = document.getElementsByName(el)[0].value = response[el] ;					// on rempli l'input
	    }
	}
	http.send(params);
});
