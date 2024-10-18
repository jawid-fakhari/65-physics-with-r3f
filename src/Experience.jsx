import { OrbitControls } from '@react-three/drei'
import { CuboidCollider, Physics, RigidBody } from '@react-three/rapier'
import { Perf } from 'r3f-perf'
import { useRef } from 'react'

export default function Experience() {
    const cubeRef = useRef()

    const cubeJump = () => {
        cubeRef.current.applyImpulse({ x: 0, y: 5, z: 0 })
        cubeRef.current.applyTorqueImpulse({ x: 0, y: 1, z: 0 })
    }

    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight
            castShadow
            position={[1, 2, 3]}
            intensity={4.5}
        />
        <ambientLight intensity={1.5} />

        <Physics debug>

            <RigidBody colliders="ball">
                <mesh
                    castShadow
                    position={[-1.5, 2, 0]}
                >
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </RigidBody>

            <RigidBody
                ref={cubeRef}
                position={[1.5, 2, 0]}
                restitution={0.2} //bounce object
                friction={0.7} //frizione tra gli oggetti
                gravityScale={1}
            //colliders={false} //per togliere il collider dal rigdibody
            >
                <mesh
                    castShadow
                    onClick={cubeJump}
                >
                    <boxGeometry />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
                <CuboidCollider
                    //usiamo custom collider per poter applicare massa e avere un controllo maggiore sul physics
                    mass={2}
                    args={[0.5, 0.5, 0.5]}
                />
            </RigidBody>

            <RigidBody type='fixed'>
                <mesh
                    receiveShadow
                    position-y={- 1.25}
                >
                    <boxGeometry args={[10, 0.5, 10]} />
                    <meshStandardMaterial color="greenyellow" />
                </mesh>
            </RigidBody>

        </Physics>
    </>
}