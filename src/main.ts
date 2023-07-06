import Effect from "./utils/Effect";


window.onload=()=>{
  const canvas = document.getElementById("app-canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d", {}) as CanvasRenderingContext2D;

  canvas.width = window.innerWidth || 600;
  canvas.height = window.innerHeight || 600;

  ctx.getContextAttributes().willReadFrequently = true;

  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;

  const effect = new Effect(canvas, ctx);

  function animate(){
    
    ctx.clearRect(0,0, canvas.width, canvas.height);
    effect.render();
    requestAnimationFrame(animate)
  }
  animate()
};