
// Opções Defaults
var map;
var pin = 'img/pin.png';
var marker_icon = 'img/marker-icon.png';
var points = [];
var pointsrand = [];
var randomMarkers = new Array(0);
var routeMarkers = new Array(0);
var lines = [];
var lineColor = '#DCDCDC';
var fillColor = '#DCDCDC';
var lineWidth = 4;
var polygon;
var routePath;
var routePath2;
var ShowHideONOFF = 0;
var radiansPerDegree = Math.PI / 180.0;
var degreesPerRadian = 180.0 / Math.PI;
var earthRadiusMeters = 6367460.0;
var metersPerDegree = 2.0 * Math.PI * earthRadiusMeters / 360.0;
var metersPerKm = 1000.0;
var meters2PerHectare = 10000.0;
var feetPerMeter = 3.2808399;
var feetPerMile = 5280.0;
var acresPerMile2 = 640;

// JSON com as localidades que serão mostradas no mapa
var markersData = [
					{
						lat: -4.1747376,
						lng: -38.4777528,
						bairro: "Teste 01",
						tipo: "Teste 01",
						preco: "Teste 01",
						img: "img/placeholder.jpg"
					},
					{
						lat: -4.1697222,
						lng: -38.4526091,
						bairro: "Teste 02",
						tipo: "Teste 02",
						preco: "Teste 02",
						img: "img/placeholder.jpg"
					},
					{
						lat: -4.1247376,
						lng: -38.4077528,
						bairro: "Teste 03",
						tipo: "Teste 03",
						preco: "Teste 03",
						img: "img/placeholder.jpg"
					},
					{
						lat: -4.1147376,
						lng: -38.4177528,
						bairro: "Teste 04",
						tipo: "Teste 04",
						preco: "Teste 04",
						img: "img/placeholder.jpg"
					},
					{
						lat: -4.1047376,
						lng: -38.1777528,
						bairro: "Teste 05",
						tipo: "Teste 05",
						preco: "Teste 05",
						img: "img/placeholder.jpg"
					},
					{
						lat: -4.1947376,
						lng: -38.4977528,
						bairro: "Teste 06",
						tipo: "Teste 06",
						preco: "Teste 06",
						img: "img/placeholder.jpg"
					},
				];

function initialize()
{
    var latlng = new google.maps.LatLng(-4.1747376, -38.4777528);
    var myOptions = {
        zoom: 12, 
        center: latlng, 
        draggableCursor: 'crosshair', 
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        }};
    
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    google.maps.event.addListener(map, 'click', mapclick);

    Display();

    //delay by 200ms!
    setTimeout('Regen()', 200);
	
    // Informações nos pontos de marcação
    infoWindow = new google.maps.InfoWindow();
}

function Regen()
{
    pointsrand = [];
    pointsInfo = [];
    for (var i = 0; i < markersData.length; i++)
    {
        var point = new google.maps.LatLng(markersData[i].lat, markersData[i].lng);
        var info = [markersData[i].bairro, markersData[i].tipo, markersData[i].preco, markersData[i].img];
        pointsrand.push(point);
        pointsInfo.push(info);
    }
}

function mapclick(event)
{
    points.push(event.latLng);
    ShowHideONOFF = 0;
    Display();
}


function SearchPointsAdd()
{
    if (!(polygon == undefined))
    { 
        if (randomMarkers)
        { 
            for (i in randomMarkers)
            {
                randomMarkers[i].setMap(null);
            }
        }

        for (var i = 0; i < pointsrand.length; ++i)
        {
            if (polygon.containsLatLng(pointsrand[i]))
            {
                var marker = placeMarkerred(pointsrand[i], i, pointsInfo[i]);
                randomMarkers.push(marker);
                marker.setMap(map);
            }
        }
    }
}

function Display()
{ 
    if (routeMarkers)
    { 
        for (i in routeMarkers)
        { 
            routeMarkers[i].setMap(null);
        }
    }

    if (!(routePath == undefined))
    {
        routePath.setMap(null);
    }

    if (!(routePath2 == undefined))
    {
        routePath2.setMap(null);
    }

    if (!(polygon == undefined))
    {
        polygon.setMap(null);
    }

    routePath = new google.maps.Polyline({
        path: points,
        strokeColor: lineColor,
        strokeOpacity: 1.0,
        strokeWeight: lineWidth,
        geodesic: true
    });

    routePath.setMap(map);

    if (points.length > 2)
    {
        var points2 = [points[0], points[points.length - 1]];

        routePath2 = new google.maps.Polyline({
            path: points2,
            strokeColor: lineColor,
            strokeOpacity: 1.0,
            strokeWeight: lineWidth,
            geodesic: true
        });

        routePath2.setMap(map);

        polygon = new google.maps.Polygon({
            paths: points,
            strokeColor: "#000000",
            strokeOpacity: 1,
            strokeWeight: 1,
            fillColor: fillColor,
            fillOpacity: 0.5
        });

        polygon.setMap(map);

        var areaMeters2 = SphericalPolygonAreaMeters2(points);

        if (areaMeters2 < 1000000.0)
            areaMeters2 = PlanarPolygonAreaMeters2(points);
    }

    lines = [];
    routeMarkers = new Array(0);

    for (var i = 0; i < points.length; ++i)
    {
        var marker = placeMarker(points[i], i);
        routeMarkers.push(marker);
        marker.setMap(map);
    }

    SearchPointsAdd();
}


// Função para remover todos os pontos desenhados no mapa
function ClearAllPoints()
{
    if (randomMarkers)
    {
        for (i in randomMarkers)
        {
            randomMarkers[i].setMap(null);
        }
    }

    if (routeMarkers)
    {
        for (i in routeMarkers)
        {
            routeMarkers[i].setMap(null);
        }
    }

    if (!(routePath == undefined))
    {
        routePath.setMap(null);
    }

    if (!(routePath2 == undefined))
    {
        routePath2.setMap(null);
    }

    if (!(polygon == undefined))
    {
        polygon.setMap(null);
    }

    routeMarkers = new Array(0);
    routePath = null;
    routePath2 = null;
    polygon = null;
    points = [];
}

// Função para remover apenas os marcadores
function removeMarkers()
{
    if (randomMarkers)
    {
        for (i in randomMarkers)
        {
            randomMarkers[i].setMap(null);
        }
    }
}

// Remove o último ponto adicionado
function DeleteLastPoint()
{
    if (points.length > 0) {
        points.length--;
        Display();
    }
		
	if (points.length < 3) {
        removeMarkers();
    }
} 

// Função para adicionar o pin que marca o desenho
function placeMarker(location, number)
{
    var image = new google.maps.MarkerImage(pin,
                                                new google.maps.Size(32, 32),
                                                new google.maps.Point(0, 0),
                                                new google.maps.Point(9, 33));
            
    var marker = new google.maps.Marker({
        position: location, 
        map: map, 
        icon: image, 
        draggable: true
    });

	// Também exibi os pins quando o evento de arrastar o pin acionado
    google.maps.event.addListener(marker, 'dragend', function (event)
    {
        points[number] = event.latLng;
        Display();
    });
	
	// No click direito no mouse, remove o último ponto adicionado
	google.maps.event.addListener(marker, 'rightclick', function(){
		DeleteLastPoint();
	});

    return marker;
}

// Função para colocar o pin da localidade
function placeMarkerred(location, number, info)
{
    var image = new google.maps.MarkerImage(marker_icon,
                                                new google.maps.Size(32, 32),
                                                new google.maps.Point(0, 0),
                                                new google.maps.Point(9, 33));

    var marker = new google.maps.Marker({
        position: location, 
        map: map, 
        icon: image, 
        draggable: false,
        animation: google.maps.Animation.DROP
    });
    
    // Evento que dá instrução à API para estar alerta ao click no marcador.
    // Define o conteúdo e abre a Info Window.
    google.maps.event.addListener(marker, 'click', function() {
        // Variável que define a estrutura do HTML a inserir na Info Window.
        var content = '<div id="content">' +
        '<div><img width="300" height="150" src="'+ info[3] +'" /></div>' +
        '<div class="title"><h1>' + info[0] + '</h1></div>' +
        '<div class="content">' + info[1] + '<br />' +
        '<strong>' + info[2] + '</strong><br /></div></div>';

        // O conteúdo da variável iwContent é inserido na Info Window.
        infoWindow.setContent(content);

        // A Info Window é aberta com um click no marcador.
        infoWindow.open(map, marker);
        
        // Evento que fecha a infoWindow com click no mapa.
        google.maps.event.addListener(infoWindow,'closeclick',function(){
            // Remove a Animação
            marker.setAnimation(null);
        });
        
        if (marker.getAnimation() != null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    });

    google.maps.event.addListener(marker, 'dragend', function (event)
    {
        points[number] = event.latLng;
        Display();
    });

    return marker;
}

function ShowHide()
{
    if (ShowHideONOFF == 0)
    {
        ShowHideONOFF = 1;
        for (var i = 0; i < pointsrand.length; ++i)
        {
            var marker = placeMarkerred(pointsrand[i], i);
            randomMarkers.push(marker);
            marker.setMap(map);
        }
    }
    else
    {
        ShowHideONOFF = 0;
        for (var i = 0; i < pointsrand.length; ++i)
        {
            randomMarkers[i].setMap(null);
        }
        Display();
    }
}

function SphericalPolygonAreaMeters2(points)
{
    var totalAngle = 0.0;
    for (i = 0; i < points.length; ++i)
    {
        var j = (i + 1) % points.length;
        var k = (i + 2) % points.length;
        totalAngle += Angle(points[i], points[j], points[k]);
    }

    var planarTotalAngle = (points.length - 2) * 180.0;
    var sphericalExcess = totalAngle - planarTotalAngle;

    if (sphericalExcess > 420.0)
    {
        totalAngle = points.length * 360.0 - totalAngle;
        sphericalExcess = totalAngle - planarTotalAngle;
    }
    else if (sphericalExcess > 300.0 && sphericalExcess < 420.0)
    {
        sphericalExcess = Math.abs(360.0 - sphericalExcess);
    }

    return sphericalExcess * radiansPerDegree * earthRadiusMeters * earthRadiusMeters;
}


function PlanarPolygonAreaMeters2(points)
{
    var a = 0.0;
    for (var i = 0; i < points.length; ++i)
    {
        var j = (i + 1) % points.length;
        var xi = points[i].lng() * metersPerDegree * Math.cos(points[i].lat() * radiansPerDegree);
        var yi = points[i].lat() * metersPerDegree;
        var xj = points[j].lng() * metersPerDegree * Math.cos(points[j].lat() * radiansPerDegree);
        var yj = points[j].lat() * metersPerDegree;
        a += xi * yj - xj * yi;
    }

    return Math.abs(a / 2.0);
}

function Angle(p1, p2, p3)
{
    var bearing21 = Bearing(p2, p1);
    var bearing23 = Bearing(p2, p3);
    var angle = bearing21 - bearing23;

    if (angle < 0.0)
        angle += 360.0;
    return angle;
}

function Bearing(from, to)
{
    var lat1 = from.lat() * radiansPerDegree;
    var lon1 = from.lng() * radiansPerDegree;
    var lat2 = to.lat() * radiansPerDegree;
    var lon2 = to.lng() * radiansPerDegree;
    var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
    if (angle < 0.0)
    {
        angle += Math.PI * 2.0;
        angle = angle * degreesPerRadian;
    }
    return angle;
}

if (!google.maps.Polygon.prototype.getBounds) {
    google.maps.Polygon.prototype.getBounds = function (latLng) {
        var bounds = new google.maps.LatLngBounds();
        var paths = this.getPaths();
        var path;

        for (var p = 0; p < paths.getLength(); p++) {
            path = paths.getAt(p);
            for (var i = 0; i < path.getLength(); i++) {
                bounds.extend(path.getAt(i));
            }
        }
        return bounds;
    };
};

google.maps.Polygon.prototype.containsLatLng = function (latLng) {
    var bounds = this.getBounds();
    if (bounds != null && !bounds.contains(latLng)) {
        return false;
    }
    
    var inPoly = false;
    var numPaths = this.getPaths().getLength();
    for (var p = 0; p < numPaths; p++) {
        var path = this.getPaths().getAt(p);
        var numPoints = path.getLength();
        var j = numPoints - 1;

        for (var i = 0; i < numPoints; i++) {
            var vertex1 = path.getAt(i);
            var vertex2 = path.getAt(j);
            if (vertex1.lng() < latLng.lng() && vertex2.lng() >= latLng.lng() || vertex2.lng() < latLng.lng() && vertex1.lng() >= latLng.lng()) {
                if (vertex1.lat() + (latLng.lng() - vertex1.lng()) / (vertex2.lng() - vertex1.lng()) * (vertex2.lat() - vertex1.lat()) < latLng.lat()) {
                    inPoly = !inPoly;
                }
            }
            j = i;
        }
    }
    return inPoly;
};

google.maps.LatLng.prototype.distanceFrom = function (newLatLng) {

    var lat1 = this.lat();
    var radianLat1 = lat1 * (Math.PI / 180);
    var lng1 = this.lng();
    var radianLng1 = lng1 * (Math.PI / 180);
    var lat2 = newLatLng.lat();
    var radianLat2 = lat2 * (Math.PI / 180);
    var lng2 = newLatLng.lng();
    var radianLng2 = lng2 * (Math.PI / 180);
    var earth_radius = 3959; 

    var diffLat = (radianLat1 - radianLat2);
    var diffLng = (radianLng1 - radianLng2);
    var sinLat = Math.sin(diffLat / 2);
    var sinLng = Math.sin(diffLng / 2);

    var a = Math.pow(sinLat, 2.0) + Math.cos(radianLat1) * Math.cos(radianLat2) * Math.pow(sinLng, 2.0);

    var distance = earth_radius * 2 * Math.asin(Math.min(1, Math.sqrt(a)));

    return distance;
};

google.maps.event.addDomListener(window, 'load', initialize);