

  function buildCharts() {
	d3.json("/project3/comments").then((data) => {
	  const author = data.map( x => x.author);
	  const domain = data.map(x => x.domain);
	  const subreddit_name = data.map(x=> x.subreddit_name.substring(2,100));
	  const created_date = data.map(x => x.created_date);
		const num_comments = data.map(x => x.num_comments);
		const ups = data.map(x => x.ups);
		console.log(author)
		console.log(domain)
		console.log(subreddit_name)
		console.log(created_date)
		console.log(num_comments)
		console.log(ups);
    
	  // Build a Bubble Chart
	  var bubbleLayout = {

		hovermode: "closest",		
	  };
	  var bubbleData = [
		{
		  x: created_date,
		  y: author,
		  mode: "markers",
		  marker: {
			size: 10,
			color: "blue",
			colorscale: "Earth"
		  }
		}
	  ];
  
	  Plotly.plot("bubble", bubbleData, bubbleLayout);
  
	  // Build a Pie Chart
	  // HINT: You will need to use slice() to grab the top 10 sample_values,
	  // otu_ids, and labels (10 each).
	  var pieData = [
		{
		  values: num_comments.slice(0, 50),
		  labels: subreddit_name.slice(0, 50),

		  type: "pie"
		}
	  ];
  
	  var pieLayout = {
		width: 750,
    height: 750,
		margin: { t: 10, l: 10, r:10, b:10 }
	  };
  
	  Plotly.plot("pie", pieData, pieLayout);
	});
  }
  
	buildCharts();

 
  