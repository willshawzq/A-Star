class AStar extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
			current: 84,
			start: 84,
			target: 215,
			result: [],
			openArr: [84],
			closeArr: [],
			openObj: {}
	    };
	}
	getMap() {
		let map = [
			0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			0,0,0,0,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,
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
			0,0,0,0,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,
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
			path = '',
			{openArr, openObj, result} = this.state,
			colorArr = ['white', 'green', 'red', 'gray'];
		return mapArr.map((val, i)=>{
			if(val === 3) this.state.closeArr.push(i);
			if(result.indexOf(i) > -1) {
				path = 'yellow';
			}else {
				path = '';
			}
			return (
				<span key={i} data-x={i % 20} data-y={Math.floor(i/20)} className={`star ${colorArr[val]} ${path}`}>
					{openArr.indexOf(i) > -1 ? i : ''}
				</span>
			);
		});
	}
	openFn() {
		let current = this.state.openArr.shift();
		if(current === this.state.target) {
			//console.info(current, this.state.target);
			this.showLine();
			return;
		};
		console.info(current);

		this.state.closeArr.push(current);
		this.getSiblings(current);
		let openObj = this.state.openObj;
		this.state.openArr.sort((s, t)=>{
			return openObj[s]['num'] - openObj[t]['num'];
		});
		//console.log(openObj);
		//console.log(this.state.openArr);
		this.openFn();
	}
	showLine() {
		let closeArr = this.state.closeArr;
		let last = closeArr.pop();
		this.findParent(last);
	}
	findParent(index) {
		this.state.result.unshift(index);
		let parent = this.state.openObj[index]['parent'];
		if(parent == this.state.start){
			this.setState({
				result: this.state.result
			});
			console.log(this.state.result);
			return;
		}
		this.findParent(parent);
	}
	f(index) {
		return this.g(index) + this.h(index);
	}
	g(index) {
		let start 	= [ 84 % 20, Math.floor(84 / 20)],
			current = [ index % 20, Math.floor(index / 20)];
		let x = current[0] - start[0],
			y = current[1] - start[1];
		return Math.sqrt(x*x + y*y);
	}
	h(index) {
		let end 	= [ 215 % 20, Math.floor(215 / 20)],
			current = [ index % 20, Math.floor(index / 20)];
		let x = end[0] - current[0],
			y = end[1] - current[1];
		return Math.sqrt(x*x + y*y);
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
				//if(val == 215) console.log(index);
				this.state.openArr.push(val);
				this.state.openObj[val] = {
					num: this.f(val),
					parent: index
				}
			}
		});
	}
	componentDidMount() {
		this.openFn();
		this.setState({
			openArr: this.state.openArr
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