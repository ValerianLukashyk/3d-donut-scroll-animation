import * as THREE from "three";
import Scrollbar from 'smooth-scrollbar';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import donut from "./models/donut.glb";
import { gsap } from "gsap";
import { RenderPass, EffectComposer, OutlinePass } from "three-outlinepass"
import Animations from './animations'


window.isMobile = function () {
  let check = false;
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};


class Scene {
  constructor() {
    const scrollOptions = {
      damping: 0.02,
      alwaysShowTracks: true,
      continuousScrolling: true,
    }
    this.donuts = []
    this.intersected = []
    this.endScene = false
    this.scrollBar = Scrollbar.init(document.querySelector('#my-scrollbar'), scrollOptions);

    this.container = document.getElementById("scene");
    this.img1 = document.getElementsByClassName("gallery-image1")[0];
    this.img2 = document.getElementsByClassName("gallery-image2")[0];
    this.img3 = document.getElementsByClassName("gallery-image3")[0];
    this.img4 = document.getElementsByClassName("gallery-image4")[0];

    if (isMobile()) {
      this.img1.style.display = "block"
      this.img2.style.display = "block"
    } else {
      this.img3.style.display = "block"
      this.img4.style.display = "block"
    }

    this.xFirst = isMobile() ? -2 : -7
    this.xSecond = isMobile() ? 3.5 : 12
    this.xThird = isMobile() ? -2 : -7
    this.xMove = isMobile() ? -2 : -7

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height
    this.frustum = 10;
    this.camera = new THREE.OrthographicCamera(
      this.frustum * this.aspect / - 2,
      this.frustum * this.aspect / 2,
      this.frustum / 2,
      this.frustum / -2,
      0,
      1000
    );
    this.camera.position.z = 10;
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.raycaster.layers.set(1);

    this.mouse = new THREE.Vector2();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.container,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(2);
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.loader = new GLTFLoader();
    // this.donut = null;
    this.group = new THREE.Group();

    this.animator = new Animations()

    this.compose = new EffectComposer(this.renderer);
    
    this.setupResize();
    this.resize();
    this.addOutlinePass()
    this.addObject();
    this.addDummy()
    this.addLight();
    this.bindEvents();
    this.render();

  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.aspect = window.innerWidth / window.innerHeight;
    this.camera.left = this.frustum * this.aspect / - 2;
    this.camera.right = this.frustum * this.aspect / 2;
    this.camera.top = this.frustum / 2;
    this.camera.bottom = - this.frustum / 2;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.xFirst = isMobile() ? -2 : -7
    this.xSecond = isMobile() ? 3.5 : 12
    this.xThird = isMobile() ? -2 : -7
    this.xMove = isMobile() ? -2 : -7

  }

  addOutlinePass() {
    this.selectedObjects = []
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.outlinePass = new OutlinePass(new THREE.Vector2(this.width, this.height), this.scene, this.camera, this.selectedObjects);
    this.outlinePass.renderToScreen = true;
    this.outlinePass.selectedObjects = this.selectedObjects;

    this.compose.addPass(this.renderPass);
    this.compose.addPass(this.outlinePass);
    this.params = {
      edgeStrength: 5,
      edgeGlow: 2,
      edgeThickness: 2.0,
      pulsePeriod: 5,
      usePatternTexture: false
    };

    this.outlinePass.edgeStrength = this.params.edgeStrength;
    this.outlinePass.edgeGlow = this.params.edgeGlow;
    this.outlinePass.visibleEdgeColor.set(0xffffff);
    this.outlinePass.hiddenEdgeColor.set(0xffffff);


  }

  onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    this.mouse.x = (event.clientX / this.width) * 2 - 1;
    this.mouse.y = - (event.clientY / this.height) * 2 + 1;

  }

  bindEvents() {
    window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
  }

  addObject() {
    this.loader.load(donut, (donut) => {
      window.MESH = donut
      let mesh
      let topMat
      const count = 2
      const colors = ["orange", 'yellow', 'lightblue', "purple", "green"]
      const scale = isMobile() ? 10 : 20
      this.donut = donut.scene.children[2];

      this.donut.position.y = -0.015;
      this.donut.rotation.x = Math.PI / 4;
      this.donut.layers.enable(1)
      this.donut.scale.set(scale, scale, scale)

      this.donuts.push(this.donut)

      this.group.add(this.donut)
      // this.intersected.push(this.donut)
      for (let i = 0; i < count; i++) {
        mesh = this.donut.clone()

        topMat = mesh.children[0].material.clone()
        topMat.color.set(colors[Math.floor(Math.random() * colors.length)])

        mesh.children[0].material = topMat
        mesh.material = this.donut.material.clone()
        // mesh.scale.set(0.01, 0.01, 0.01)
        mesh.position.x = isMobile() ? -2.5 * (i + 1) : -4 * (i + 1)
        mesh.material.format = THREE.RGBAFormat
        mesh.children[0].material.format = THREE.RGBAFormat
        mesh.material.transparent = true
        mesh.children[0].material.transparent = true
        mesh.material.opacity = 0
        mesh.children[0].material.opacity = 0
        mesh.visible = false
        this.group.add(mesh);
        this.donuts.push(mesh)


      }
    });
    this.scene.add(this.group);
  }

  addDummy() {
    const geometry = new THREE.BufferGeometry()
    const material = new THREE.MeshStandardMaterial()
    const mesh = new THREE.Mesh(geometry, material)
    mesh.visible = false
    mesh.name = "dummy"
    this.scene.add(mesh)
  }
  addLight() {
    this.light = new THREE.SpotLight(0xffffff, 2);
    this.light.position.set(0, 5, 7);
    this.scene.add(this.light);
  }

  animate() {
    this.donut2 = this.scene.children[0].children[1]
    this.donut3 = this.scene.children[0].children[2]
    const donuts = [this.donut2, this.donut3]

    if (this.scrollBar.offset.y > 0) {
      this.animator.move(this.group, { x: 0, y: 0, z: 0 })
      this.animator.scale(this.group, { x: 1, y: 1, z: 1 })
      this.animator.rotate(this.group, { x: 0, y: 0, z: 0 })

      donuts.forEach(donut => {
        this.animator.opacity(donut.material, 0, 1, () => {
          this.donut2.visible = false
          this.donut3.visible = false
        })
        this.animator.opacity(donut.children[0].material, 0)
      })

      if (this.scrollBar.offset.y > this.height * 0.5) {

        this.animator.move(this.group, { x: this.xFirst, y: 3, z: 0 })
        this.animator.opacity(".second", 1, 0.5, () => { }, 0.1)
      }

      if (this.scrollBar.offset.y > this.height * 1.5) {
        const showImage = () => {
          const images = [this.img1, this.img3]
          images.forEach((img, i) => {
            this.animator.opacity(img, 1, 0.2, () => this.animator.opacity(i===1 ? this.img2 : this.img4, 1, 0.1, () => { }, 0.1), 0.1)
          })
          
        }
        this.animator.move(this.group, { x: this.xSecond, y: 3, z: 0 })
        this.animator.opacity(".three", 1, 0.2, () => showImage(), 0)
      }

      if (this.scrollBar.offset.y > this.height * 2.5) {
        this.animator.opacity(".four", 1, 0.5, () => { }, 0.1)
        this.donut2.visible = true
        this.donut3.visible = true
        this.endScene = true

        donuts.forEach((elem) => {
          this.animator.opacity(elem.material, 2, 1, () => { }, 0)
          this.animator.opacity(elem.children[0].material, 2, 1, () => { }, 0)

        })

        this.animator.move(this.group, { x: isMobile() ? -0.5 : 6, y: isMobile() ? 2.5 : -4, z: 0 })
        this.animator.scale(this.group, { x: 0.9, y: 0.9, z: 0.9 })
        this.animator.rotate(this.group, {
          z: isMobile() ? Math.PI / 1.335 : 0,
          y: isMobile() ? Math.PI / 4 : 0,
          x: isMobile() ? 0 : Math.PI / 4,
        })
      }
    }

    this.container.style.top = this.scrollBar.offset.y + "px";
    if (this.donut) this.donut.rotation.y += 0.005;
    if (this.endScene === true) {
      this.donut2.rotation.y += 0.003;
      this.donut3.rotation.y -= 0.004;
    }
  }

  render() {
    this.timer = Date.now() * 0.0002;
    this.animate();
    // this.renderer.render(this.scene, this.camera);
    this.compose.render(this.scene, this.camera)
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // calculate objects intersecting the picking ray
    this.intersects = this.raycaster.intersectObjects(this.scene.children);

    const scale = isMobile() ? 10 : 20
    const interScale = isMobile() ? 14 : 25
    this.intersected[0] && this.intersected[0].scale.lerp(new THREE.Vector3(scale, scale, scale), 0.05)
    if (this.intersects.length === 0) {
      this.selectedObjects[0] = this.scene.getObjectByName("dummy");
    }
    for (let i = 0; i < this.intersects.length; i++) {
      //Changing Color of Children Mesh
      // this.intersects[i].object.children[0] && this.intersects[i].object.children[0].material.color.set(new THREE.Color("yellow"))

      // Changing Scaling on Hover
      this.intersects[i].object.scale.lerp(new THREE.Vector3(interScale, interScale, interScale), 0.05)
      this.intersected[0] = this.intersects[i].object
      this.selectedObjects[0] = this.intersects[i].object

    }

    this.donuts.forEach((d) => {
      if (d !== this.intersected[0]) {
        d.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.05)
      }
    })

    window.requestAnimationFrame(this.render.bind(this));
  }

}

window.APP = new Scene();
