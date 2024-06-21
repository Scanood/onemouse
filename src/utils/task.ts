interface Task {
    eventType: string,
    collect: boolean
}

// only 'run' task can be added
class TaskManager {
    tasks: Array<Task>
    constructor() {
        this.tasks = []
    }
    add(type: string): void {
        if (this.tasks.some((task) => task.eventType === type)) return
        this.tasks.push({ eventType: type, collect: true })
    }
    delete(type: string): void {
        const index = this.tasks.findIndex((task) => task.eventType === type)
        if (index == -1) return
        this.tasks.splice(index, 1)
    }
    clear(): void {
        this.tasks.length = 0
    }
}

const taskManger = new TaskManager()

export {
    taskManger
}