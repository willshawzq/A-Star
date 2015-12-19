class AStar extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	cols: props.cols || Math.floor(Math.sqrt(props.map.length)),
	    	gridSize: props.gridSize,//网格尺寸
			start: props.map.indexOf(1),//起点序号
			target: props.map.indexOf(2),//目标点序号
			result: [],//结果数组
			openArr: [props.map.indexOf(1)],//估价排序数组
			closeArr: [],//已排出的干扰节点
			openObj: {}//保持估价数组中节点的估价和父节点
	    };
	}
	renderMap() {
		let mapArr = this.props.map,
			path = '',
			{openArr, openObj, result} = this.state,
			colorArr = ['white', 'green', 'red', 'gray'];
		return mapArr.map((val, i)=>{
			if(val === 3) this.state.closeArr.push(i);
			path = result.indexOf(i) > -1 ? 'black' : '';
			return (
				<span key={i} data-x={i % 20} data-y={Math.floor(i/20)} 
					className={`star ${colorArr[val]} ${path}`}>
					{openArr.indexOf(i) > -1 ? i : ''}
				</span>
			);
		});
	}
	openFn() {
		let current = this.state.openArr.shift();
		/*
		*如果此节点为目标节点，closeArr最后
		*一次push的节点便为此节点的父节点
		*/
		if(current === this.state.target) {
			this.showLine();
			return;
		};
		/*此节点已经走过，则放入到close数组中去*/
		this.state.closeArr.push(current);
		/*获取当前节点周围8个方向的兄弟节点*/
		this.getSiblings(current);
		/*对openArr进行排序，*/
		let openObj = this.state.openObj;
		this.state.openArr.sort((s, t)=>{
			return openObj[s]['num'] - openObj[t]['num'];
		});
		/*递归调用*/
		this.openFn();
	}
	showLine() {
		let last = this.state.closeArr.pop();
		this.findParent(last);
	}
	findParent(index) {
		/*将查找到的路径上的元素，插入到数组头部*/
		this.state.result.unshift(index);
		/*获取当前值得父元素*/
		let parent = this.state.openObj[index]['parent'];
		/*找到初始节点时，停止回溯*/
		if(parent == this.state.start){
			/*重新绘制页面*/
			this.setState({
				result: this.state.result
			});
			return;
		}
		this.findParent(parent);
	}
	/*节点估价函数*/
	f(index) {
		return this.g(index) + this.h(index);
	}
	/*计算起点到当前节点的代价（直线距离）*/
	g(index) {
		let cols = this.state.cols;
		let start 	= [ this.state.start % cols, Math.floor(this.state.start / cols)],
			current = [ index % cols, Math.floor(index / cols)];
		let x = current[0] - start[0],
			y = current[1] - start[1];
		return Math.sqrt(x*x + y*y);
	}
	/*计算当前节点到目标节点的代价（直线距离）*/
	h(index) {
		let cols = this.state.cols;
		let end 	= [ this.state.target % cols, Math.floor(this.state.target / cols)],
			current = [ index % cols, Math.floor(index / cols)];
		let x = end[0] - current[0],
			y = end[1] - current[1];
		return Math.sqrt(x*x + y*y);
	}
	getSiblings(index) {
		let {map} = this.props,
			cols = this.state.cols,
			len = map.length,
			siblings = [
				index - (cols + 1),
				index - cols,
				index - (cols - 1),
				index - 1,
				index + 1,
				index + (cols - 1),
				index + cols,
				index + (cols + 1)
			].map((val)=>{
				if(0 < val < len) return val;
			});
		siblings.map((val, i)=>{
			let included = this.state.closeArr.indexOf(val) < 0
							&& this.state.openArr.indexOf(val) < 0;
			if(included) {
				this.state.openArr.push(val);
				this.state.openObj[val] = {
					num: this.f(val),
					parent: index
				}
			}
		});
	}
	findWay() {
		this.openFn();
		this.setState({
			openArr: this.state.openArr
		});
	}
	render() {
		let {map, cols} = this.props,
			len = map.length;
		let width = Math.sqrt(len) * this.state.gridSize;
		return (
			<div>
				<button onClick={this.findWay.bind(this)}>寻路</button>
				<div className='AStar' style={{width: `${width}px`}}>
					{this.renderMap()}
				</div>
			</div>
		);
	}
}
AStar.defaultProps = {
    gridSize: 20
}
AStar.propTypes = {
     map: React.PropTypes.array.isRequired,
     cols: React.PropTypes.number,
     gridSize: React.PropTypes.number
}
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
ReactDOM.render(
	<AStar map={map} cols={20}/>,
	document.getElementById('example')
);