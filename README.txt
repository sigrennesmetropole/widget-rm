*******************************************
Intégration du widget RM
*******************************************

Prérequis :
 * JQuery 3.3.1
 * Leaflet 1.3.1 : https://leafletjs.com/download.html
 * Leaflet.markercluster 1.4.1 : https://github.com/Leaflet/Leaflet.markercluster
 * Easyautocomplete 1.3.5 : http://easyautocomplete.com/download

Ajouter les fichiers suivants à votre projet :
 * src/widget-rm.js 
 * src/widget-rm.css

*******************************************
Utilisation du widget RM
*******************************************

 * Insérer une div avec un identifiant
Exemple :
<div id="widget"></div>

 * Appel du widget en javascript sans paramètre, utilise le type perimetreScolaire
<script>
	$('#widget').widgetRM();
</script>

Options :
type :
	- perimetreScolaire (par défaut)
	- ccas

Exemple :
<script>
	$('#widget').widgetRM({
		'type': 'ccas'
	});
</script>

*******************************************
Personnalisation du widget RM
*******************************************

 * Modifier la couleur des clusters :
CSS dans le fichier widget-rm.css 

 * Modifier le picto de la carte :
Il suffit de remplacer l'image "marker-icon.png" du plugin leaflet

 * Styliser la carte :
Identifiant "map", par défaut : height: 500px;

 * Styliser l'input de recherche d'adresse :
Identifiant "addressSearch"

 * Styliser les messages d'erreur :
Identifiant "adresseHelp"