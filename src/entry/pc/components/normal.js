class Normal {
    constructor() {
        this.initLayout();
    }

    initLayout = () => {
        const mes = document.createElement('h1');
        mes.innerHTML = '正常加载完成！';
        document.body.appendChild(mes);
    }
}

export default Normal;