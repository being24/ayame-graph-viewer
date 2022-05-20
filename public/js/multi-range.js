customElements.define("multi-range", class extends HTMLElement {
	connectedCallback() {
		if (this.shadowRoot) return
		
		this.attachShadow({mode: "open"}).innerHTML = `
			<style>
				:host {
					display: inline-block;
					width: 100%;
                    height: 28px;
                    margin: 6px;
                    --line-inactive: #1c232b;
                    --line-active: #207578;
                    --thumb: #45989b;
                    --back: #1c232b;
				}
				input[type="range"] {
					width: 100%;
					height: 28px;
                    margin: 0;
					cursor: pointer;
					outline: none;
					-webkit-appearance: none;
				}
				input[type="range"]::-webkit-slider-runnable-track {
					height: 8px;
				}
				input[type="range"]::-webkit-slider-thumb {
					height: 24px;
					width: 24px;
					margin-top: -8px;
					background: var(--thumb);
					border-radius: 50%;
					box-shadow: 0 0 5px 0 #0003;
					-webkit-appearance: none;
				}
				
				.container {
					width: 100%;
					position: relative;
				}
				#back, #front {
					position: absolute;
                    border-radius: 14px;
					top: 0;
					left: 0;
                    background: var(--back);
				}
				#back::-webkit-slider-thumb,
				#front::-webkit-slider-thumb {
					position: relative;
					z-index: 1;
				}
				#back::-webkit-slider-runnable-track {
					background: linear-gradient(to right, var(--line-inactive) 0% var(--min),
						var(--line-active) var(--min) var(--max),
						var(--line-inactive) var(--max) 100%);
				}
				#front,
				#front::-webkit-slider-runnable-track {
					background: transparent;
				}
			</style>

			<div class="container">
				<input id="back" type="range" min="-50" max="2000" value="0" />
				<input id="front" type="range" min="-50" max="2000" value="2000" />
			</div>
		`
		
		this._elems = {
			back: this.shadowRoot.getElementById("back"),
			front: this.shadowRoot.getElementById("front"),
		}
		
		this._elems.back.addEventListener("input", () => {
            const event = new CustomEvent('change')
            this.dispatchEvent(event)
            this._redraw() 
        })
		this._elems.front.addEventListener("input", () => {
            const event = new CustomEvent('change')
            this.dispatchEvent(event)
            this._redraw()
        })
		this._redraw()
	}
	
	_redraw() {
		const { min, max, from, to } = this
		const x = (from - min) / (max - min) * 100
		const y = (to - min) / (max - min) * 100
		this._elems.back.style.setProperty("--min", x + "%")
		this._elems.back.style.setProperty("--max", y + "%")
	}
	
	get min() {
		return this._elems.back.min
	}
	
	set min(value) {
		const [min, max] = [+value || 0, this.max].sort((a, b) => a - b)
		this._elems.back.min = min
		this._elems.back.max = max
		this._elems.front.min = min
		this._elems.front.max = max
		this._redraw()
	}
	
	get max() {
		return this._elems.back.max
	}
	
	set max(value) {
		const [min, max] = [this.min, +value || 0].sort((a, b) => a - b)
		this._elems.back.min = min
		this._elems.back.max = max
		this._elems.front.min = min
		this._elems.front.max = max
		this._redraw()
	}
	
	get from() {
		return Math.min(this._elems.back.value, this._elems.front.value)
	}
	
	set from(value) {
		const [min, max] = [+value || 0, this.to].sort((a, b) => a - b)
		this._elems.back.value = min
		this._elems.front.value = max
		this._redraw()
	}
	
	get to() {
		return Math.max(this._elems.back.value, this._elems.front.value)
	}
	
	set to(value) {
		const [min, max] = [this.from, +value || 0].sort((a, b) => a - b)
		this._elems.back.value = min
		this._elems.front.value = max
		this._redraw()
	}
	
	get value() {
		return [this._elems.back.value, this._elems.front.value].sort((a, b) => a - b).join(",")
	}
	
	set value(value) {
		const [min, max] = value.split(",").slice(0, 2).sort((a, b) => a - b)
		this._elems.back.value = min
		this._elems.front.value = max
		this._redraw()
	}
})
