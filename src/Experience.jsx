import { OrbitControls, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import { CuboidCollider, CylinderCollider, Physics, RigidBody } from '@react-three/rapier'
import { Perf } from 'r3f-perf'
import { useRef, useState } from 'react'
import * as THREE from 'three'

export default function Experience() {
    const hamburger = useGLTF('./hamburger.glb')

    const cubeRef = useRef();

    const twister = useRef()

    //ritornare l'audio e salvarlo in uno stato locale che poi verrà utilizzato collisionEnter function
    const [hitSound] = useState(() => new Audio('./hit.mp3'))


    /************
     * Jump function
     */
    const cubeJump = () => {
        //trovare massa attraverso metodo mass()⬇️
        const mass = cubeRef.current.mass();

        cubeRef.current.applyImpulse({ x: 0, y: 5 * mass, z: 0 })
        cubeRef.current.applyTorqueImpulse({ x: 0, y: 1, z: 0 })
    }

    /************
     * Twister Animation
     */
    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        //setNextKinematicRotation ha bisogno di Quaternion e non Euler.
        //To solve this, we are going to create a Three.js Euler, then create a Three.js Quaternion out of this Euler and since most mathematics objects are inter-compatible between Three.js and Rapier, we are going to send that Quaternion to setNextKinematicRotation.
        const eulerRotation = new THREE.Euler(0, time * 3, 0)
        const quaternionRotation = new THREE.Quaternion()
        quaternionRotation.setFromEuler(eulerRotation)

        //Kinematic objec ha due funzioni importanti(setNextKinematicTranslation, setNextKinematicRotation)
        twister.current.setNextKinematicRotation(quaternionRotation)

        const angle = time * 0.5
        const x = Math.cos(angle)
        const z = Math.sin(angle)
        twister.current.setNextKinematicTranslation({ x: x, y: -0.8, z: z })
    })

    /*****************
     * Collider Events
     */
    const collisionEnter = () => {
        // hitSound.current = 0
        // hitSound.volume = Math.random()
        // hitSound.play()
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

            {/* Sfera arancione */}
            <RigidBody colliders="ball">
                <mesh
                    castShadow
                    position={[-1.5, 2, 0]}
                >
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </RigidBody>

            {/* Twister Cubo allungato Rosso  */}
            <RigidBody
                ref={twister}
                position={[0, - 0.8, 0]}
                friction={0}
                type="kinematicPosition"//tipo di oggetto che possiamo muovere e ruotare
            >
                <mesh scale={[0.3, 0.3, 5]}>
                    <boxGeometry castShadow />
                    <meshStandardMaterial color="red" />
                </mesh>
            </RigidBody>

            {/* Cubo viola */}
            <RigidBody
                ref={cubeRef}
                position={[1.5, 2, 0]}
                restitution={0.2} //bounce object
                friction={0.7} //frizione tra gli oggetti
                gravityScale={1}
                colliders={false} //per togliere il collider dal rigdibody
                onCollisionEnter={collisionEnter}
            // onCollisionExit={() => { console.log('exit') }}
            // onSleep={() => { console.log('sleep') }}
            // onWake={() => { console.log('wake') }}
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
                    mass={2} //per avere più controllo sul physics mass e impulce possiamo salvarlo in un variabile, e chiamarlo dove abbiamo bisogno ⬆️ 
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

            {/* Importare modello creato, possiamo scegliere il tipo del collider, attenzione a trimesh e hull che sono pesanti*/}
            <RigidBody colliders={false} position={[0, 4, 0]} >
                <primitive object={hamburger.scene} scale={0.15} />

                {/* se volessimo usare custom collider */}
                <CylinderCollider args={[0.25, 0.75]} />
            </RigidBody>

            {/* creare dei muri invisibile sul piano */}
            <RigidBody type='fixed'>
                <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.5]} />
                <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, -5.5]} />
                <CuboidCollider args={[0.5, 2, 5]} position={[5.5, 1, 0]} />
                <CuboidCollider args={[0.5, 2, 5]} position={[-5.5, 1, 0]} />
            </RigidBody>

        </Physics >
    </>
}

/**
 * Events
    * onCollisionEnter: when the RigidBody hit something.
    * onCollisionExit: when the RigidBody separates from the object it just hit.
    * onSleep: when the RigidBody starts sleeping.
    * onWake: when the RigidBody stops sleeping.
*/