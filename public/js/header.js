document.getElementById("title-root-a").addEventListener("click", function(){
    window.location.href = "./"
}, false)


let vh = window.innerHeight * 0.01
document.documentElement.style.setProperty('--vh', vh + "px")

window.addEventListener('resize', () => {
    vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', vh + "px")
})

