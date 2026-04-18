import * as THREE from 'three';

export function createLearningFactory() {
  const root = new THREE.Group();
  root.name = 'learning-factory-root';

  const machineAnimations = [];
  const machineGroups = [];

  const platform = new THREE.Mesh(
    new THREE.BoxGeometry(16, 0.4, 8),
    new THREE.MeshStandardMaterial({
      color: '#14263f',
      metalness: 0.2,
      roughness: 0.9,
    }),
  );
  platform.position.set(0, 0.2, 0);
  root.add(platform);

  const accentLine = new THREE.Mesh(
    new THREE.BoxGeometry(14, 0.06, 0.24),
    new THREE.MeshStandardMaterial({
      color: '#2d78ff',
      emissive: '#123e99',
      emissiveIntensity: 0.4,
    }),
  );
  accentLine.position.set(0, 0.43, 0);
  root.add(accentLine);

  const machineDefinitions = [
    {
      id: 'machine-a',
      name: '注塑单元 A',
      type: 'Molding Cell',
      status: '运行中',
      temperature: 64,
      position: [-4.5, 0.4, -1.8],
      color: '#3d7eff',
      speed: 1.2,
    },
    {
      id: 'machine-b',
      name: '装配单元 B',
      type: 'Assembly Cell',
      status: '待机',
      temperature: 41,
      position: [0, 0.4, 0.4],
      color: '#39c985',
      speed: 0.8,
    },
    {
      id: 'machine-c',
      name: '检测单元 C',
      type: 'Inspection Cell',
      status: '高负载',
      temperature: 72,
      position: [4.5, 0.4, -1.2],
      color: '#ff9052',
      speed: 1.45,
    },
  ];

  machineDefinitions.forEach((definition) => {
    const machine = createMachine(definition);
    machine.position.set(...definition.position);
    machine.userData.machineRoot = true;
    machine.userData.machineMeta = {
      id: definition.id,
      name: definition.name,
      type: definition.type,
      status: definition.status,
      temperature: definition.temperature,
    };

    machineGroups.push(machine);
    machineAnimations.push({
      tick: (elapsed) => {
        machine.userData.arm.rotation.z = Math.sin(elapsed * definition.speed) * 0.45;
        machine.userData.head.position.y = 1.82 + Math.sin(elapsed * definition.speed * 1.2) * 0.12;
      },
    });

    root.add(machine);
  });

  const conveyor = new THREE.Mesh(
    new THREE.BoxGeometry(12, 0.18, 1.4),
    new THREE.MeshStandardMaterial({
      color: '#1d3551',
      metalness: 0.4,
      roughness: 0.55,
    }),
  );
  conveyor.position.set(0, 0.6, 2.1);
  root.add(conveyor);

  const instancedBoxes = createInstancedBoxes();
  instancedBoxes.position.set(-5.8, 0.78, 2.1);
  root.add(instancedBoxes);

  return {
    root,
    machineGroups,
    machineAnimations,
    instancedBoxes,
    instancedCount: instancedBoxes.count,
  };
}

function createMachine(definition) {
  const group = new THREE.Group();
  group.name = definition.id;

  const baseMaterial = new THREE.MeshStandardMaterial({
    color: definition.color,
    metalness: 0.28,
    roughness: 0.45,
    emissive: '#000000',
    emissiveIntensity: 0,
  });

  const darkMaterial = new THREE.MeshStandardMaterial({
    color: '#1f2737',
    metalness: 0.2,
    roughness: 0.62,
    emissive: '#000000',
    emissiveIntensity: 0,
  });

  const base = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.9, 1.6), baseMaterial.clone());
  base.position.y = 0.45;
  group.add(base);

  const column = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 1.6, 0.42),
    darkMaterial.clone(),
  );
  column.position.set(0, 1.55, 0);
  group.add(column);

  const armPivot = new THREE.Group();
  armPivot.position.set(0, 2.18, 0);
  group.add(armPivot);

  const arm = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.2, 0.28),
    baseMaterial.clone(),
  );
  arm.position.set(0.8, 0, 0);
  armPivot.add(arm);

  const head = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 0.55, 24),
    darkMaterial.clone(),
  );
  head.rotation.x = Math.PI / 2;
  head.position.set(1.62, -0.28, 0);
  armPivot.add(head);

  const monitor = new THREE.Mesh(
    new THREE.BoxGeometry(0.65, 0.45, 0.08),
    new THREE.MeshStandardMaterial({
      color: '#94d8ff',
      emissive: '#2da6ff',
      emissiveIntensity: 0.8,
      metalness: 0.2,
      roughness: 0.18,
    }),
  );
  monitor.position.set(-0.48, 1.25, 0.86);
  group.add(monitor);

  group.userData.arm = armPivot;
  group.userData.head = head;

  return group;
}

function createInstancedBoxes() {
  const geometry = new THREE.BoxGeometry(0.42, 0.42, 0.42);
  const material = new THREE.MeshStandardMaterial({
    color: '#72d3ff',
    emissive: '#0f5cff',
    emissiveIntensity: 0.15,
    metalness: 0.08,
    roughness: 0.72,
  });

  const rows = 3;
  const columns = 12;
  const count = rows * columns;
  const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
  const matrix = new THREE.Matrix4();

  let index = 0;

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      matrix.makeTranslation(column * 0.58, row * 0.54, 0);
      instancedMesh.setMatrixAt(index, matrix);
      index += 1;
    }
  }

  instancedMesh.instanceMatrix.needsUpdate = true;

  return instancedMesh;
}
