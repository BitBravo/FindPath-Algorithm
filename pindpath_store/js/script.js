$(document).ready(function(){
	$("#searchTxt").keyup(function (event) {
		if (event.keyCode === 13) {
			var multicount = $("#multicount").val();
			var searchValue = $("#searchTxt").val().toLowerCase();
			console.log(multicount, searchValue)
			startFindPath(searchValue);
		}
	});
	$("#multicount").change( function () {
		const multiCount = parseInt($("#multicount").val())
		if(multiCount>0) {
            config.multiTargetCount = multiCount;
            setConfig(config);
		} else {
			alert('Please set the multi target counts!')
		}
	})
});

const config = {
    startPoint: [55 ,33],
    multiTargetCount: 3,
    areaSize: [154, 35],
    tileSize: {
        titleWidth: 8,
        tileHeight: 15
    },
    wall
}
setConfig(config);

function startProcess(searchValue) {
	var searchValue = $("#searchTxt").val().toLowerCase();
	startFindPath(searchValue);
}

