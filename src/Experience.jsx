import { OrbitControls } from '@react-three/drei'
import { CuboidCollider, Physics, RigidBody } from '@react-three/rapier'
import { Perf } from 'r3f-perf'

export default function Experience() {
    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
        <ambientLight intensity={1.5} />

        <Physics debug>

            <RigidBody colliders="ball">
                <mesh castShadow position={[0, 4, 0]}>
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </RigidBody>

            <RigidBody colliders={false} position={[0, 1, 0]}>
                <CuboidCollider args={[1.5, 1.5, 0.5]} />
                <CuboidCollider
                    args={[1, 1, 1]}
                    position={[0, 0, 0.5]}
                />
                <mesh castShadow rotation-x={Math.PI * 0.5}>
                    <torusGeometry args={[1, 0.5, 32]} />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
            </RigidBody>

            <RigidBody type='fixed'>
                <mesh receiveShadow position-y={- 1.25}>
                    <boxGeometry args={[10, 0.5, 10]} />
                    <meshStandardMaterial color="greenyellow" />
                </mesh>
            </RigidBody>

        </Physics>
    </>
}