/* global _ React */
import { fetchUtil } from 'util';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.slideInterval = '';
    this.state = {
      allData: [
        { userName: '刘一', itemName: '雪花糕 1000g/袋', quantity: 1 },
        { userName: '王二', itemName: '冰欺凌 double', quantity: 3 },
        { userName: '苏三', itemName: '三全毛利小五郞 特供10kg', quantity: 11 },
        { userName: '李四', itemName: '周五好好玩好好聚', quantity: 2 },
        { userName: '毛五', itemName: '三羊开泰AD翻跟斗苦的方法饿丰富', quantity: 111 },
        { userName: '赵六', itemName: '屁屁哦朋90 金卡好撒浪费撒啊啊啊', quantity: 1.11 },
      ],
      deleteCurr: false,
      appedWill: false,
      slide: false,
      currText: '',
      nextText: '',
    };
  }

  componentWillMount() {
    fetchUtil({ url: '/api/index/trades' })
      .then((data) => {
        this.setState({ currText: data[0] ? this.getTradeText(data[0]) : '暂无交易' });
        if (data.length > 1) {
          this.setState({ nextText: this.getTradeText(data[1]) });
          this.startSilde(data);
        }
      });
  }

  componentWillUnmount() {
    this.slideInterval = null;
  }

  getTradeText(obj) {
    const safeName = (name, l = 0, r = 0, t = '*') => {
      if (name.length <= 3) return name;
      const leftText = name.substr(0, l);
      const rightText = name.substr(name.length - r, name.length);
      return `${leftText}${t}${t}${rightText}`;
    };
    const buyer = safeName(obj.userName, 2, 1);
    const itemName = safeName(obj.itemName, 12, 0, '.');
    return `${buyer} 购买 ${itemName} ${obj.quantity}件}`;
  }

  startSilde(data) {
    setTimeout(() => {
      // 3秒后，当前显示的条目开始滑动
      const allData = JSON.parse(JSON.stringify(data));
      allData.push(allData.shift());
      this.setState({
        slide: true,
      });
      setTimeout(() => {
        // 滑动时间0.5s，滑动结束后，删除滑出的条目，并将slide标志置为false
        this.setState({
          slide: false,
          deleteCurr: true,
        });
        // 等页面重新render，所以此此处需要一个异步
        setTimeout(() => {
          // 在此之前只剩下一个条目了
          this.setState({
            deleteCurr: false,
            currText: this.getTradeText(allData[0]),
            nextText: this.getTradeText(allData[1]),
          });
          // 页面刷新过后恢复成两个条目了，然后循环调用
          this.startSilde(allData);
        }, 100);
      }, 600);
    }, 3000);
  }

  render() {
    return (
      <div className='trade-rec'>
        <div className='left'>
          <img src='/assets/images/other-images/trade-rec.png' alt='' />
        </div>
        <div className='right'>
          <i className='icon-jd icon-notice'></i>
          <div className='texts'>
            {this.state.deleteCurr ? null : <p className={this.state.slide ? 'slide' : ''}>{this.state.currText}</p>}
            <p>{this.state.nextText}</p>
          </div>
        </div>
      </div>
    );
  }
}
