/**
 * Prérequis :
 * JQuery 3.3.1
 * Leaflet 1.3.1
 * Leaflet.markercluster 1.4.1
 * Easyautocomplete 1.3.5
 */
(function($)
{
    $.fn.widgetRM = function(options)
    {
        var defaults =
        {
            "type": "perimetreScolaire"
        };
        
        var parameters = $.extend(defaults, options); 
        
        return this.each(function()
        {
            $(this).html('<input id="addressSearch" type="text"><small id="adresseHelp" class="form-text text-muted"></small><div id="map" style="height: 500px;"></div>');
            theSLD_BODY= '<?xml version="1.0" encoding="UTF-8"?>' +
'<sld:StyledLayerDescriptor xmlns:sld="http://www.opengis.net/sld" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">' +
  '<sld:NamedLayer>' +
    '<sld:Name>ladm_terri:quartier</sld:Name>' +
    '<sld:UserStyle>' +
      '<sld:FeatureTypeStyle>' +
        '<sld:Rule>' +
        '<sld:MaxScaleDenominator>100000</sld:MaxScaleDenominator>' +
          '<sld:Name>Quartier_nom</sld:Name>' +
          '<sld:Title>Quartier_nom</sld:Title>' +
          '<sld:PolygonSymbolizer>' +
            '<sld:Fill>' +
              '<sld:CssParameter name="fill">#808080</sld:CssParameter>' +
              '<sld:CssParameter name="fill-opacity">0.5</sld:CssParameter>' +
            '</sld:Fill>' +
            '<sld:Stroke>' +
              '<sld:CssParameter name="stroke">#000000</sld:CssParameter>' +
              '<sld:CssParameter name="stroke-opacity">0.5</sld:CssParameter>' +
              '<sld:CssParameter name="stroke-width">1</sld:CssParameter>' +
            '</sld:Stroke>' +
          '</sld:PolygonSymbolizer>' +
          '<sld:TextSymbolizer>' +
                '<Geometry>' +
                  '<ogc:Function name="centroid">' +
                     '<ogc:PropertyName>shape</ogc:PropertyName>' +
                  '</ogc:Function>' +
               '</Geometry>' +
            '<sld:Label>' +
              '<ogc:PropertyName>nom</ogc:PropertyName>' +
            '</sld:Label>' +
            '<sld:Font>' +
            '<sld:CssParameter name="font-family">Arial</sld:CssParameter>' +
            '<sld:CssParameter name="font-size">11</sld:CssParameter>' +
            '<sld:CssParameter name="font-style">normal</sld:CssParameter>' +
            '</sld:Font>' +
            '<sld:VendorOption name="conflictResolution">false</sld:VendorOption>' +
        '<VendorOption name="graphic-resize">stretch</VendorOption>' +
        '<VendorOption name="partials">true</VendorOption>' +
          '</sld:TextSymbolizer>' +
        '</sld:Rule>' +
        
        '<sld:Rule>' +
        '<sld:MinScaleDenominator>100000</sld:MinScaleDenominator>' +
          '<sld:Name>Quartier_nom</sld:Name>' +
          '<sld:Title>Quartier_nom</sld:Title>' +
          '<sld:PolygonSymbolizer>' +
            '<sld:Fill>' +
              '<sld:CssParameter name="fill">#808080</sld:CssParameter>' +
              '<sld:CssParameter name="fill-opacity">0.5</sld:CssParameter>' +
            '</sld:Fill>' +
            '<sld:Stroke>' +
              '<sld:CssParameter name="stroke">#000000</sld:CssParameter>' +
              '<sld:CssParameter name="stroke-opacity">0.5</sld:CssParameter>' +
              '<sld:CssParameter name="stroke-width">1</sld:CssParameter>' +
            '</sld:Stroke>' +
          '</sld:PolygonSymbolizer>' +
        '</sld:Rule>' + 
      '</sld:FeatureTypeStyle>' +
    '</sld:UserStyle>' +
  '</sld:NamedLayer>' +
'</sld:StyledLayerDescriptor>';
            
            
            // Init Map
            var pvciLayer = L.tileLayer(
                "https://public.sig.rennesmetropole.fr/geowebcache/service/wmts?" +
                "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
                "&TILEMATRIXSET=EPSG:3857" +
                "&FORMAT=image/png"+
                "&LAYER=ref_fonds:pvci_simple_gris"+
                "&TILEMATRIX=EPSG:3857:{z}" +
                "&TILEROW={y}" +
                "&TILECOL={x}",
                {
                    attribution: 'Plan de ville communal et intercommunal, Référentiel voies et adresses : Rennes Métropole',
                    id: 1,
                    center: [48.1, -1.67],
                    minZoom : 0,
                    maxZoom : 20
                }
            );
            var orthoLayer = L.tileLayer(
                "https://public.sig.rennesmetropole.fr/geowebcache/service/wmts?" +
                "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
                "&TILEMATRIXSET=EPSG:3857" +
                "&FORMAT=image/jpeg"+
                "&LAYER=raster:ortho2017"+
                "&TILEMATRIX=EPSG:3857:{z}" +
                "&TILEROW={y}" +
                "&TILECOL={x}",
                {
                    attribution: 'Orthophotographie aérienne 2017 sur Rennes Métropole',
                    id: 2,
                    center: [48.1, -1.67],
                    minZoom : 0,
                    maxZoom : 20
                }
            );
            var quartierLayer = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/wms', {
                attribution: 'Périmètres des 12 quartiers de la Ville de Rennes',
                id: 3,
                center: [48.1, -1.67],
                minZoom: 0,
                maxZoom: 20,
                format: 'image/png',
                transparent: true,
                layers: 'ladm_terri:quartier',
                SLD_BODY : theSLD_BODY
            });
            var map = L.map('map', {
                center: [48.1, -1.67],
                zoom: 10,
                layers: [pvciLayer]
            });
            var baseMaps = {
                'Plan de Rennes métropole': pvciLayer,
                'Vue aérienne': orthoLayer
            };
            L.control.layers(baseMaps).addTo(map);
            
            var markerCluster = L.markerClusterGroup({
                iconCreateFunction: function (cluster) {
                    var childCount = cluster.getChildCount();
                    var c = ' widget-rm-marker-cluster-';
                    if (childCount < 10) {
                        c += 'small';
                    } else if (childCount < 100) {
                        c += 'medium';
                    } else {
                        c += 'large';
                    }
                    return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'widget-rm-marker-cluster' + c, iconSize: new L.Point(40, 40) });
                }
            });
            
            var domicileMarker, marker, polygon, circle;
            var urlRva;

            switch(parameters.type) {
                case 'perimetreScolaire':
                    console.log('perimetreScolaire');
                    var url = 'https://api-secteur.sig.rennesmetropole.fr/v1/epsg:4326/perimetre-scolaire/';
                    urlRva = 'https://api-rva.sig.rennesmetropole.fr/?key=a45f31dc19810d7b567e&version=1.0&format=json&epsg=3948&cmd=getfulladdresses&insee=35238&query=';
                    var sucessAjax = function(data) {
                        markerCluster.clearLayers();
                        var markerExtent = [];
                        
                        // Ajout domicile
                        domicileMarker = L.marker(
                            [data['adresseDomicile'].y, data['adresseDomicile'].x],
                            {
                                title: 'Domicile : ' + data['adresseDomicile'].addr3
                            }
                        ).addTo(map);
                        domicileMarker.bindPopup('<b><font size="2">Votre domicile</font></b><br/>' + data['adresseDomicile'].addr3).openPopup();
                        markerExtent.push(domicileMarker);
                        
                        //Ajout établissements scolaires
                        for (var i = 0; i < data['ecoles'].length; i++) {
                            var marker = L.marker(
                                [data['ecoles'][i]['adresse'].y, data['ecoles'][i]['adresse'].x],
                                {
                                    title: data['ecoles'][i].nom
                                }
                            );
                            var contentPopup = '<b><font size="2">' + data['ecoles'][i].nom + '</font></b><br/>' + 
                                                data['ecoles'][i]['adresse'].addr3 + '<br/>';
//                                                + 
  //                                              data['ecoles'][i].description + '<br/>';
                            var footer = "";
                            idSitorg = data['ecoles'][i].idSitorg
                            if(data['ecoles'][i].idOrgPrincipal != null){
                                var url ='https://metropole.rennes.fr/organisme/' + data['ecoles'][i].nom.replace(/[\u0300-\u036f]/g, "").replace(/'/g, " ").replace(/\//g, " ").toLowerCase().replace(/ /g,'-') + '-' + data['ecoles'][i].idOrgPrincipal  
                                footer = '<a href="' + url + '" target="_blank">' + url + '</a>';
                            }
                             //   footer = '<a href="http://' + data['ecoles'][i].siteInternet + '" target="_blank">' + data['ecoles'][i].siteInternet + '</a>';
                            //}
                            //if(data['ecoles'][i].siteInternet != null){
                             //   footer = '<a href="http://' + data['ecoles'][i].siteInternet + '" target="_blank">' + data['ecoles'][i].siteInternet + '</a>';
                            //}
                            marker.bindPopup(contentPopup + footer);
                            markerExtent.push(marker);
                            markerCluster.addLayer(marker);
                        }
                        // Cluster
                        map.addLayer(markerCluster);
                        
                        // Extent
                        var group = new L.featureGroup(markerExtent);
                        map.fitBounds(group.getBounds(), { padding: [100, 100] });
                    }
                    break;
                case 'ccas':
                    console.log('ccas');
                    var url = 'https://api-secteur.sig.rennesmetropole.fr/v1/epsg:4326/ccas/';
                    urlRva = 'https://api-rva.sig.rennesmetropole.fr/?key=a45f31dc19810d7b567e&version=1.0&format=json&epsg=3948&cmd=getfulladdresses&query=';
                    var sucessAjax = function(data) {
                        var markerExtent = [];

                        // Ajout domicile
                        domicileMarker = L.marker(
                            [data['adresseDomicile'].y, data['adresseDomicile'].x],
                            {
                                title: 'Domicile : ' + data['adresseDomicile'].addr3
                            }
                        ).addTo(map);
                        domicileMarker.bindPopup('<b><font size="2">Votre domicile</font></b><br/>' + data['adresseDomicile'].addr3).openPopup();
                        markerExtent.push(domicileMarker);
                        
                        // Ajout ccas
                        marker = L.marker(
                            [data['ccas'].y, data['ccas'].x],
                            {
                                title: data['ccas'].nom
                            }
                        ).addTo(map);
                        var contentPopup = '<b><font size="2">' + data['ccas'].nom + '</font></b><br/>' + 
                                            data['ccas'].adresse + '<br/>';
                        //if(data['ccas'].description != null){ 
                        //    contentPopup += data['ccas'].description + '<br/>';
                        //}
                        var footer = "";
                        if(data['ccas'].idOrg != null){
                                var url ='https://metropole.rennes.fr/organisme/' + data['ccas'].nom.replace(/[\u0300-\u036f]/g, "").replace(/'/g, " ").replace(/\//g, " ").toLowerCase().replace(/ /g,'-') + '-' + data['ccas'].idOrg  
                                footer = '<a href="' + url + '" target="_blank">' + url + '</a>';
                            }
                        //if(data['ccas'].siteInternet != null){
                        //    footer = '<a href="http://' + data['ccas'].siteInternet + '" target="_blank">' + data['ccas'].siteInternet + '</a>';
                        //}
                        marker.bindPopup(contentPopup + footer);
                        markerExtent.push(marker);
                        
                        // Extent
                        var group = new L.featureGroup(markerExtent);
                        map.fitBounds(group.getBounds(), { padding: [100, 100] });
                    }
                    break;
//                case 'bureauVote':
//                    console.log('bureauVote');
//                    break;
                case 'quartier':
                    console.log('quartier');
                    quartierLayer.addTo(map);
                    var southWest = L.latLng(48.0732214985779009, -1.7590042766937635);
                    northEast = L.latLng(48.1554485532821559, -1.6172213143614309);
                    bounds = L.latLngBounds(southWest, northEast);

                    map.fitBounds(bounds);
            
                    var url = 'https://api-secteur.sig.rennesmetropole.fr/v1/epsg:4326/quartier/';
                    urlRva = 'https://api-rva.sig.rennesmetropole.fr/?key=a45f31dc19810d7b567e&version=1.0&format=json&epsg=3948&cmd=getfulladdresses&insee=35238&query=';
                    var sucessAjax = function(data) {
                        var markerExtent = [];

                        // Ajout domicile
                        domicileMarker = L.marker(
                            [data['adresseDomicile'].y, data['adresseDomicile'].x],
                            {
                                title: 'Domicile : ' + data['adresseDomicile'].addr3
                            }
                        ).addTo(map);
                        domicileMarker.bindPopup('<b><font size="2">Votre domicile</font></b><br/>' + data['adresseDomicile'].addr3 +
                        '<br><br><b><font size="2">Votre quartier</font></b><br/>' + data['quartier'].nom).openPopup();
                        markerExtent.push(domicileMarker);
                        
                        // Ajout quartier
                        var quartiers = [{
                        "type": "Feature",
                        "properties": {"nom": data['quartier'].nom,
                                        "x": data['quartier'].x,
                                        "y": data['quartier'].y,
                                        },
                        "geometry": JSON.parse(data['quartier'].geometryJson)
                        }];
                        
                        polygon = L.geoJSON(quartiers, {
                            style: function(feature) {
                                return {label : feature.properties.nom,fontColor: "#DD3627",
                                        fontSize: "12px",
                                        fontFamily: "Courier New, monospace",
                                        fontWeight: "bold",
                                        color: "#DD3627",
                                        labelOutlineColor: "white",
                                        labelOutlineWidth: 3};
                            },
                            onEachFeature: function(feature, layer) {    
                                layer.bindTooltip(feature.properties.nom, {permanent:true ,className: 'widget-rm-quartier'});                            
                                                            
                          }
                        }).addTo(map);
                            
                        markerExtent.push(polygon);
                        
                        // Extent
                        var group = new L.featureGroup(markerExtent);
                        map.fitBounds(group.getBounds(), { padding: [50, 50] });
                        
                        //display tooltip of layer polygon switch zoom
                        map.on('zoomend', function() {
                        var zoom = map.getZoom();
                        if( map.hasLayer(polygon) ) {
                            polygon.eachLayer( function (layer){
                                if ( zoom >= 12 && (!layer.getTooltip()) ) {
                                     layer.bindTooltip(layer.feature.properties.nom, {permanent:true ,className: 'widget-rm-quartier'});  
                                } else if ( zoom < 12 && (layer.getTooltip()) ) {
                                    layer.unbindTooltip();
                                }
                            });
                        }
                    });
                    }
                    break;
                case 'distconfinement':
                    console.log('distance de confinement');
                    var url = 'https://api-secteur.sig.rennesmetropole.fr/v1/epsg:4326/quartier/'; // url obligatoire pour traitement des données
                    urlRva = 'https://api-rva.sig.rennesmetropole.fr/?key=a45f31dc19810d7b567e&version=1.0&format=json&epsg=3948&cmd=getfulladdresses&query=';
                    var sucessAjax = function(data) {
                        var markerExtent = [];

                        // Ajout domicile
                        domicileMarker = L.marker(
                            [data['adresseDomicile'].y, data['adresseDomicile'].x],
                            {
                                title: 'Domicile : ' + data['adresseDomicile'].addr3
                            }
                        ).addTo(map);
                        domicileMarker.bindPopup('<b><font size="2">Votre domicile</font></b><br/>' + data['adresseDomicile'].addr3 ).openPopup();
                        markerExtent.push(domicileMarker);
                        
                        // Ajout périmètre de circulation
                        circle = L.circle([data['adresseDomicile'].y, data['adresseDomicile'].x], {
                            color: '#44E000',
                            weight:0.5,
                            fillColor: '#9FDF83',
                            fillOpacity: 0.5,
                            radius: 1000
                        }).addTo(map);
                            
                        markerExtent.push(circle);
                        
                        // Extent
                        var group = new L.featureGroup(markerExtent);
                        map.fitBounds(group.getBounds(), { padding: [50, 50] });
                        
                    }
                    break;
                default:
                    console.log('Le widget' + parameters.type + 'n\'existe pas.');   
            }
            
            // Init autocomplete
            var options = {
                minCharNumber: 3,
                adjustWidth: false,
                listLocation: function(data) {
                    return data.rva.answer.addresses;
                },
                url: function(phrase) {
                    return urlRva + phrase;
                },
                getValue: "addr3",
                ajaxSettings: {
                    dataType: "json"
                },
                requestDelay: 300,
                list: {
                    onChooseEvent: function() {
                        $('#adresseHelp').css('display','none');
                        console.log($("#addressSearch").getSelectedItemData().idaddress);
                        $.ajax({
                            type: 'GET',
                            dataType: 'json',
                            headers: { 
                                'X-API-KEY': 'c583383089f1c7e544e32cdf44c11045'
                            },
                            url: url + $("#addressSearch").getSelectedItemData().idaddress,
                            success: function(data) {
                                $('#adresseHelp').css('display','none');

                                // Clear markers, markersClusters if exists
                                markerCluster.clearLayers();
                                if(map.hasLayer(domicileMarker)) {
                                    map.removeLayer(domicileMarker);
                                }
                                if(map.hasLayer(marker)) {
                                    map.removeLayer(marker);
                                }
                                if(map.hasLayer(polygon)) {
                                    map.removeLayer(polygon);
                                }
                                if(map.hasLayer(circle)) {
                                    map.removeLayer(circle);
                                }

                                // Appel success widget(type)
                                sucessAjax(data);
                            },
                            error: function() {
                                $('#adresseHelp').html('Une erreur s\'est produite.');
                                $('#adresseHelp').css('display','block');
                            }
                        });  
                    },
                    sort: {
                        enabled: true
                    },
                    maxNumberOfElements: 1000
                }
            };
            $("#addressSearch").easyAutocomplete(options);
        });
    };
})(jQuery);
