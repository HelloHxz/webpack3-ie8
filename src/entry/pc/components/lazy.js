export default class Lazy {
    constructor() {
        this.initLayout();
    }

    initLayout = () => {
        const mes = document.createElement('h1');
        mes.innerHTML = 'reqire.ensure 异步加载完成！';
        document.body.appendChild(mes);
    }
}