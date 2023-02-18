import type {
	Vector3,
	Material,
	Object3D,
	ColorRepresentation,
	Euler,
	DirectionalLightShadow,
	BufferGeometry
} from 'three';

// port to threlte package
type Object3DOverrides = {
	position: [x: number, y: number, z: number];
	rotation: [x: number, y: number, z: number];
	scale: [x: number, y: number, z: number];

	// camera
	fov: number;
	zoom: number;
	// lights
	color: ColorRepresentation;
	intensity: number;
	shadow: DirectionalLightShadow;
	// standard mesh
	geometry: BufferGeometry;
	material: Material;
	children: ThreeGraphNode[];
};

export type ThreeGraphNode = Object3D & Object3DOverrides;

export type ObjectMap = {
	nodes: {
		[name: string]: ThreeGraphNode;
	};
	materials: { [name: string]: Material };
};

const convertVector3ToArr = (v: Vector3): [x: number, y: number, z: number] => [v.x, v.y, v.z];
const convertEulerToArr = (e: Euler): [x: number, y: number, z: number] => [e.x, e.y, e.z];

export function buildGraph(object: Object3D): ObjectMap {
	const data: ObjectMap = { nodes: {}, materials: {} };
	if (object) {
		object.traverse((obj: any) => {
			// properties that need additional fixing
			Object.defineProperties(obj, {
				position: {
					writable: true
				},
				scale: {
					writable: true
				},
				rotation: {
					writable: true
				}
			});
			obj.position = convertVector3ToArr(obj.position);
			obj.scale = convertVector3ToArr(obj.scale);
			obj.rotation = convertEulerToArr(obj.rotation);

			if (obj.name && !data.nodes[obj.name]) {
				data.nodes[obj.name] = obj;
			}
			if (obj.material && !data.materials[obj.material.name])
				data.materials[obj.material.name] = obj.material;
		});
	}

	return data;
}
