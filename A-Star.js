class AStar extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
			current: 84,
			siblings: [],
			openArr: [84],
			openObj: {84:{num: 1}},
			closeArr: [],
			target: 215
	    };
	}
	getMap() {
		let map = [
			0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,
			0,0,0,0,1,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,2,0,0,0,0,
			0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,
			0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
		];
		return map;
	}
	renderMap() {
		let mapArr = this.getMap(),
			siblings = this.state.siblings,
			colorArr = ['white', 'green', 'red', 'gray'];
			console.info(this.state.siblings);
		return mapArr.map((val, i)=>{
			if(val === 3) this.state.closeArr.push(val);
			return (
				<span key={i} data-x={i % 20} data-y={i/20} className={`star ${colorArr[val]}`}>
					{siblings[i] ? siblings[i]['num'] : ''}
				</span>
			);
		});
	}
	openFn() {
		let current = this.state.openArr.shift();
		if(current === this.state.target) return;
		this.state.closeArr.push(current);
		this.getSiblings(current);
		this.state.openArr.sort((s, t)=>{
			return s.num - t.num;
		});
	}
	f(index) {
		return this.g(index) + this.h(index);
	}
	g(index) {
		let start 	= [ 84 % 20, 84 / 20],
			current = [ index % 20, index / 20];
		let x = current[0] - start[0],
			y = current[1] - start[1];
		return parseInt(Math.sqrt(x*x, y*y).toFixed(1));
	}
	h(index) {
		let end 	= [ 215 % 20, 215 / 20],
			current = [ index % 20, 215 / 20];
		let x = end[0] - current[0],
			y = end[1] - current[1];
		return parseInt(Math.sqrt(x*x, y*y).toFixed(1));
	}
	getSiblings(index) {
		let siblings = [
			index - 21,
			index - 20,
			index - 19,
			index - 1,
			index + 1,
			index + 19,
			index + 20,
			index + 21
		].map((val)=>{
			if(0 < val < 400) return val;
		});
		siblings.map((val, i)=>{
			let included = this.state.closeArr.indexOf(val) < 0
							&& this.state.openArr.indexOf(val) < 0;
			if(included) {
				this.state.openArr.push(val);
				this.state.openObj[val] = {
					num: this.f(val)
				}
			}
		});
	}
	componentDidMount() {
		this.openFn();
		console.info(this.state.siblings);
		this.setState({
			siblings: this.state.siblings
		});
	}
	render() {
		let width = Math.sqrt(this.getMap().length) * 20;
		return (
			<div className='AStar' style={{width: `${width}px`}}>
				{this.renderMap()}
			</div>
		);
	}
}
ReactDOM.render(
	<AStar />,
	document.getElementById('example')
);