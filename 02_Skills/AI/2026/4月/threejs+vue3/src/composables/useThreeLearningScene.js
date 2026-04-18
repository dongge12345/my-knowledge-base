import { onBeforeUnmount, reactive, ref, watch } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function useThreeLearningScene() {
  const hostRef = ref(null);
  const isSceneReady = ref(false);
  const sceneState = reactive({
    autoRotate: true,
    showGrid: true,
    cubeColorLabel: '蓝色',
    lastAction: '拖拽看看场景，再点击立方体体会 3D 交互。',
  });

  let scene;
  let camera;
  let renderer;
  let controls;
  let raycaster;
  let pointer;
  let clock;
  let gridHelper;
  let demoGroup;
  let cubeMesh;
  let sphereMesh;
  let resizeHandler;
  let clickHandler;
  let highlightTimer;

  const defaultCameraPosition = new THREE.Vector3(5, 4, 7);
  const defaultTarget = new THREE.Vector3(0, 1, 0);

  function setCanvasHost(element) {
    hostRef.value = element;
  }

  function initScene() {
    const host = hostRef.value;

    if (!host || renderer) {
      return;
    }

    scene = new THREE.Scene();
    scene.background = new THREE.Color('#0b1220');
    scene.fog = new THREE.Fog('#0b1220', 10, 24);

    camera = new THREE.PerspectiveCamera(60, host.clientWidth / host.clientHeight, 0.1, 100);
    camera.position.copy(defaultCameraPosition);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.copy(defaultTarget);

    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();
    clock = new THREE.Clock();

    addLights();
    addHelpers();
    addGround();
    addDemoObjects();
    bindEvents();
    bindVueState();
    animate();

    isSceneReady.value = true;
  }

  function addLights() {
    const ambient = new THREE.AmbientLight('#ffffff', 1.8);
    scene.add(ambient);

    const directional = new THREE.DirectionalLight('#ffffff', 2.3);
    directional.position.set(6, 8, 4);
    scene.add(directional);
  }

  function addHelpers() {
    gridHelper = new THREE.GridHelper(12, 12, '#3a5f90', '#20324a');
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);
  }

  function addGround() {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 12),
      new THREE.MeshStandardMaterial({
        color: '#111a2c',
        roughness: 0.95,
        metalness: 0.08,
      }),
    );

    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);
  }

  function addDemoObjects() {
    demoGroup = new THREE.Group();

    cubeMesh = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshStandardMaterial({
        color: 'green',
        emissive: '#000000',
        emissiveIntensity: 0,
        metalness: 0.22,
        roughness: 0.35,
      }),
    );
    cubeMesh.position.y = 1.15;
    cubeMesh.userData.hitType = 'cube';
    demoGroup.add(cubeMesh);

    sphereMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 24, 24),
      new THREE.MeshStandardMaterial({
        color: '#9ee7ff',
        emissive: '#1a8cff',
        emissiveIntensity: 0.55,
        metalness: 0.12,
        roughness: 0.18,
      }),
    );
    sphereMesh.position.set(0, 2.55, 0);
    sphereMesh.userData.hitType = 'sphere';
    demoGroup.add(sphereMesh);

    scene.add(demoGroup);
  }

  function bindEvents() {
    resizeHandler = () => {
      if (!hostRef.value || !camera || !renderer) {
        return;
      }

      const width = hostRef.value.clientWidth;
      const height = hostRef.value.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    clickHandler = (event) => {
      updatePointer(event);
      handleSceneClick();
    };

    window.addEventListener('resize', resizeHandler);
    renderer.domElement.addEventListener('click', clickHandler);
  }

  function bindVueState() {
    watch(
      () => sceneState.showGrid,
      (value) => {
        if (gridHelper) {
          gridHelper.visible = value;
        }
      },
      { immediate: true },
    );
  }

  function updatePointer(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function handleSceneClick() {
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects([cubeMesh, sphereMesh], false);

    if (!intersects.length) {
      sceneState.lastAction =
        '你刚刚点到的是 3D 视口里的空白区域。这里没有模型被射线命中，所以不会触发模型交互。';
      return;
    }

    const target = intersects[0].object;

    if (target.userData.hitType === 'cube') {
      toggleCubeColor();
      pulseHighlight(cubeMesh, '#2de1ff');
      sceneState.lastAction =
        '你点击到了立方体。Raycaster 命中了 cubeMesh，所以我们切换了它的颜色。';
      return;
    }

    if (target.userData.hitType === 'sphere') {
      pulseHighlight(sphereMesh, '#ffd166');
      sceneState.lastAction =
        '你点击到了小球。说明射线拾取可以精确区分不同模型，而不是整个场景只返回一个结果。';
    }
  }

  function pulseHighlight(mesh, color) {
    if (!mesh?.material?.emissive) {
      return;
    }

    if (highlightTimer) {
      window.clearTimeout(highlightTimer);
    }

    mesh.material.emissive.set(color);
    mesh.material.emissiveIntensity = 0.7;

    highlightTimer = window.setTimeout(() => {
      if (mesh?.material?.emissive) {
        mesh.material.emissive.set('#000000');
        mesh.material.emissiveIntensity = 0;
      }
    }, 180);
  }

  function toggleCubeColor() {
    if (!cubeMesh) {
      return;
    }

    const nextColor = sceneState.cubeColorLabel === '蓝色' ? '#ff8b3d' : '#4f8cff';
    sceneState.cubeColorLabel = sceneState.cubeColorLabel === '蓝色' ? '橙色' : '蓝色';
    cubeMesh.material.color.set(nextColor);
    sceneState.lastAction = `你手动切换了立方体颜色，当前颜色是${sceneState.cubeColorLabel}。`;
  }

  function animate() {
    renderer.setAnimationLoop(() => {
      const elapsed = clock.getElapsedTime();

      controls.update();

      if (sceneState.autoRotate && demoGroup) {
        // demoGroup.rotation.y = elapsed * 0.65;
      }

      if (sphereMesh) {
        sphereMesh.position.y = 2.55 + Math.sin(elapsed * 2) * 0.18;
      }

      renderer.render(scene, camera);
    });
  }

  function resetCamera() {
    if (!camera || !controls) {
      return;
    }

    camera.position.copy(defaultCameraPosition);
    controls.target.copy(defaultTarget);
    controls.update();
    sceneState.lastAction = '相机已重置。你可以再拖拽观察，体会 camera 和 controls.target 的关系。';
  }

  function disposeScene() {
    if (!scene) {
      return;
    }

    isSceneReady.value = false;
    renderer?.setAnimationLoop(null);
    if (highlightTimer) {
      window.clearTimeout(highlightTimer);
      highlightTimer = undefined;
    }
    window.removeEventListener('resize', resizeHandler);
    renderer?.domElement.removeEventListener('click', clickHandler);
    controls?.dispose();

    scene.traverse((child) => {
      if (child.geometry) {
        child.geometry.dispose();
      }

      if (!child.material) {
        return;
      }

      if (Array.isArray(child.material)) {
        child.material.forEach((material) => material.dispose());
      } else {
        child.material.dispose();
      }
    });

    renderer?.dispose();

    if (renderer?.domElement?.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }

    scene = undefined;
    camera = undefined;
    renderer = undefined;
    controls = undefined;
    raycaster = undefined;
    pointer = undefined;
    clock = undefined;
    gridHelper = undefined;
    demoGroup = undefined;
    cubeMesh = undefined;
    sphereMesh = undefined;
  }

  watch(hostRef, (element) => {
    if (element) {
      initScene();
    }
  });

  onBeforeUnmount(disposeScene);

  return {
    setCanvasHost,
    isSceneReady,
    sceneState,
    resetCamera,
    toggleCubeColor,
  };
}
