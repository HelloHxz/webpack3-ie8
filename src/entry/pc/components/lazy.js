class Lazy {
    constructor() {
        this.initLayout();
    }

    initLayout = () => {
        const mes = document.createElement('h1');
        mes.innerHTML = 'import() 异步加载完成！';
        document.body.appendChild(mes);
    }
}

export default Lazy;