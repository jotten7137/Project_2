queue()
    .defer(d3.json, "/project3/comments")
    .await(makeGraphs);

function makeGraphs(error, commentsJson) {
	if (error) throw error;
	//Clean projectsJson data
	var project3Comments = commentsJson;
	var dateFormat = d3.time.format("%m/%d/%Y");
		project3Comments.forEach(function(d) {
			d["created_date"] = dateFormat.parse(d["created_date"]);
			d["created_date"].setDate(1);
			d["num_comments"] = +d["num_comments"];
	});


	//Create a Crossfilter instance
	var ndx = crossfilter(commentsJson);
	var all = ndx.groupAll()
	

	//Define Dimensions
	var dateDim = ndx.dimension(function(d) { return d["created_date"]; });
	var authorDim = ndx.dimension(function(d) { return d["author"]; });
	var subredditDim = ndx.dimension(function(d) { return d["subreddit_name"]; });
	var domainDim = ndx.dimension(function(d) { return d["domain"]; });
    var upsDim  = ndx.dimension(function(d) { return d["ups"]; });

	//Calculate metrics
	var numCommentsByDate = dateDim.group(); 
	var numCommentsByDomain = bodyDim.group();
	var numCommentsByAuthor = authorDim.group();
	var numCommentsBySubreddit = subredditDim.group();
	var upsByAuthor = authorDim.group().reduceSum(function(d) {
		return d["ups"];
	});




	var most_popular_author = upsByAuthor.top(1)[0].value;

	//Define values (to be used in charts)
	var minDate = dateDim.bottom(1)[0]["created_date"];
	var maxDate = dateDim.top(1)[0]["created_date"];

    //Charts
	var timeChart = dc.lineChart("#time-chart");
	var subredditChart = dc.rowChart("#subreddit-row-chart");
	var numberCommentsND = dc.numberDisplay("#number-comments-nd");
	var upsND = dc.numberDisplay("#total-ups-nd");
	var authorPie = dc.pieChart("#author-pie")

	numberCommentsND
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);

	upsND
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(ups)
		.formatNumber(d3.format(".3s"));

	timeChart
		.width(1850)
		.height(200)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(dateDim)
		.group(numCommentsByDate)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minDate, maxDate]))
		.elasticY(true)
		.xAxisLabel("Year")
		.yAxis().ticks(4);

	authorPie
    	.width(600)
	    .height(350)
	    .innerRadius(35)
	    .dimension(authorDim)
	    .group(numCommentsByAuthor)

	subredditChart
		.width(600)
		.height(350)
        .dimension(subredditDim)
        .group(numCommentsBySubreddit)
		.xAxis().ticks(4);
		
	


    dc.renderAll();

};