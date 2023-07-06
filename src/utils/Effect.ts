import Particle from "./Particle";

type flowType = {x:number, y:number, colorAngle: number, alpha: number}

class Effect{
    canvas: HTMLCanvasElement;
    height: number;
    width: number;
    particles: Particle[];
    totalParticles: number;
    cellSize: number;
    rows: number;
    cols: number;
    flowField: flowType[] = [];
    debug: boolean;
    firstRun: boolean;
    text: string;
    textInput: HTMLInputElement;
    totalParticlesInput: HTMLInputElement;;
    ctx: CanvasRenderingContext2D;

    constructor( canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D ){
        this.canvas = canvas;
        this.ctx = ctx;
        this.height = this.canvas.height;
        this.width = this.canvas.width;
        this.particles = [];
        this.totalParticles = 2000;
        this.cellSize = 1;
        this.rows = 0;
        this.cols = 0;
        this.flowField = [];
        this.debug = false;
        this.text = "Flow"
        this.firstRun = true;
        
        this.render();

        this.textInput = document.getElementById("text-input") as HTMLInputElement;
        this.totalParticlesInput = document.getElementById("total-particles-input") as HTMLInputElement;

        
        this.textInput.value = this.text
        this.totalParticlesInput.value = this.totalParticles.toString()

        this.textInput.oninput = (e: Event)=>{
            let target = e.target as HTMLInputElement;
            this.text = target.value;     
            this.firstRun = true;     
        }
        this.totalParticlesInput.oninput = (e: Event)=>{
            let target = e.target as HTMLInputElement;
            this.totalParticles = Number(target.value);    
            this.firstRun = true;      
        }

        window.addEventListener("keydown", e=>{
            if(e.key === "D") this.debug = !this.debug
        })
        window.addEventListener("resize", e=>{
            const target = e.target as Window;

            this.resize(target.innerWidth, target.innerHeight)

        })

        const menuBtn = document.getElementById("toggle-btn") as HTMLButtonElement;
        const menu = document.getElementById("control-menu") as HTMLDivElement;
        menuBtn.onclick = ()=>{
        menu.classList.toggle("display")
        }
    }
    drawText(){
        this.ctx.font = "500px Impact";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle"
        const gradient = this.ctx.createRadialGradient(this.width * 0.5 , this.height * 0.5, 1, this.width * 0.5, this.height * 0.5, this.width)
        // const gradient1 = this.ctx.createLinearGradient(0,0, this.width, this.height)
        gradient.addColorStop(0, "rgb(2,0,36")
        gradient.addColorStop(0.01, "rgb(121,39,9)")
        gradient.addColorStop(0.05, "rgb(109,89,33)")
        gradient.addColorStop(0.09, "rgb(71,100,52)")
        gradient.addColorStop(0.12, " rgb(56,123,94)")
        gradient.addColorStop(0.17, "rgb(42,145,134)")
        gradient.addColorStop(0.20, "rgb(29,165,171)")
        gradient.addColorStop(0.23, "rgb(23,82,188)")
        gradient.addColorStop(0.26, "rgb(73,15,210)")
        gradient.addColorStop(0.30, "rgb(202,50,224)")
        gradient.addColorStop(0.40, "rgb(224,50,179)")
        gradient.addColorStop(0.45, "rgb(224,50,109)")
        
        this.ctx.fillStyle = gradient
        this.ctx.fillText(this.text, this.width * 0.5, this.height * 0.5, Math.floor(this.width*0.8));
    }
    init(){
        this.particles = [];
        this.rows = Math.floor(this.height / this.cellSize);
        this.cols = Math.floor(this.width / this.cellSize);
        this.flowField = [];
        

        this.drawText();

        const pixels = this.ctx.getImageData( 0,0, this.width, this.height ).data;
        
        for (let y = 0; y < this.height; y += this.cellSize) {
            for (let x = 0; x < this.width; x += this.cellSize) {
                const index = (y * this.width + x) * 4;
                
                const red = pixels[index + 0];
                const green = pixels[index + 1];
                const blue = pixels[index + 2];
                const alpha = pixels[index + 3];
                
                const grayscale = (red + green + blue) / 3;
                const colorAngle = Number(((grayscale/255) * 6.28).toFixed(2));
                this.flowField.push({
                    x,
                    y,
                    colorAngle,
                    alpha
                })
            }
        }

        for (let i = 0; i < this.totalParticles; i++) {
            this.particles.push(new Particle(this));
        }
        this.particles.forEach(p=>p.reset())
    }
    drawGrid(){
        this.ctx.save();
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 0.3;
        for (let c = 0; c < this.cols; c++) {
            this.ctx.beginPath()
            this.ctx.moveTo(this.cellSize * c, 0);
            this.ctx.lineTo(this.cellSize * c, this.height);
            this.ctx.stroke();
        }
        for (let r = 0; r < this.rows; r++) {
            this.ctx.beginPath()
            this.ctx.moveTo(0, this.cellSize * r);
            this.ctx.lineTo(this.width, this.cellSize * r);
            this.ctx.stroke();
        }
        this.ctx.restore();
    }
    render(){
        if(this.debug) {
            this.drawGrid()
            this.drawText()
        }
        if(this.firstRun){
            this.firstRun = false;
            this.init();
        }
        this.particles.forEach(particle=>{
            particle.update();
            particle.draw(this.ctx);
        })
    }
    resize(w: number, h: number){
        this.canvas.width = w;
        this.canvas.height = h;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.render();
    }
}

export default Effect;