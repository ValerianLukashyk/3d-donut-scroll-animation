import gsap from 'gsap'

class Animations {
    constructor(scene) {

    }

    move(target, pos, dur = 1) {
        console.log(pos)
        gsap.to(target.position, {
            x: pos.x,
            y: pos.y,
            z: pos.z,
            duration: dur,
        })
    }

    scale(target, scale, dur = 1) {
        gsap.to(target.scale, {
            x: scale.x,
            y: scale.y,
            z: scale.z,
            duration: dur
        })
    }

    rotate(target, rot, dur = 1) {
        gsap.to(target.rotation, {
            x: rot.x,
            y: rot.y,
            z: rot.z,
            duration: dur,
        })
    }
    opacity(target, opacity, dur = 1, onComplete = null, delay = 0, from = false) {
        if (from) {
            gsap.from(target, {
                opacity: opacity,
                duration: dur,
                onComplete: onComplete,
                delay: delay
            })
        } else {
            gsap.to(target, {
                opacity: opacity,
                duration: dur,
                onComplete: onComplete,
                delay: delay
            })
        }
    }
    
}

export default Animations