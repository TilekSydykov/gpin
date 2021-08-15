#!/usr/bin/env node
// imports
const fs = require('fs')
const chalk = require('chalk');
const readline = require("readline");
const templates = require('./templates')
// constants
const package_name = 'gpin'
let args = (process.argv[0] === package_name)? process.argv.slice(1): process.argv.slice(2)

// functions
const help_m = () => {
    let text = chalk.blue('Nest Generator => tool for generating api code in NestJS') + ' \n \n'
    text += "commands available with description \n"
    commands.forEach(comm => {
        let comm_t = (comm.names.join(", "))
        text +=  '=> ' + chalk.green(comm_t) + ' '.repeat(20 - comm_t.length) + " " + comm.desc + '\n'
    })
    text += "\nGood luck"
    console.log(text)
}
const error_m = () => {
    console.log("Not found")
}
const generate = args => {
    const writeFiles = async project => {
        try {
            // create src if not exist
            let dir = 'src/'
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            dir += 'modules/'
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            for (const modelName in project.models) {
                if (project.models.hasOwnProperty(modelName)){
                    let model = project.models[modelName]
                    // create models
                    let modelDir = dir + modelName + '/'
                    if (!fs.existsSync(modelDir)) {
                        fs.mkdirSync(modelDir);
                    }
                    await fs.promises.writeFile(modelDir + modelName + '.controller.spec.ts', templates.getSpec(modelName))
                    await fs.promises.writeFile(modelDir + modelName + '.controller.ts', templates.getController(modelName))
                    await fs.promises.writeFile(modelDir + modelName + '.module.ts', templates.getModule(modelName))
                    await fs.promises.writeFile(modelDir + modelName + '.service.ts', templates.getService(modelName))
                    let modelDtoDir = dir + '/' + modelName + '/dto/'
                    if (!fs.existsSync(modelDtoDir)) {
                        fs.mkdirSync(modelDtoDir);
                    }
                    await fs.promises.writeFile(`${modelDtoDir}create-${modelName}.dto.ts`, templates.getCreateDTO(model, modelName))
                    await fs.promises.writeFile(`${modelDtoDir}update-${modelName}.dto.ts`, templates.getUpdateDTO(model, modelName))
                    let modelSchemaDir = dir + '/' + modelName + '/schema/'
                    if (!fs.existsSync(modelSchemaDir)) {
                        fs.mkdirSync(modelSchemaDir);
                    }
                    await fs.promises.writeFile(modelSchemaDir + modelName + '.schema.ts', templates.getModelSchema(model, modelName))
                }
            }
        }catch (err){
            console.log(err)
        }
    }
    console.time('created')
    fs.readFile( package_name + '.json', 'utf8' , (err, data) => {
        if (err && err.code === 'ENOENT') {
            console.error(`${package_name} is not initialized (${package_name}.json not found)\n\n run: "${package_name} init" to initialize schema`)
            return
        }
        writeFiles(JSON.parse(data)).then(r => {
            console.timeEnd('created')
        })
    })
}
const init = args => {
    let project = {};
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on("close", function() {
        process.exit(0);
    });
    const end = p => {
        fs.writeFile(package_name + '.json', JSON.stringify(p, null, "\t"), function (err) {
            if (err) throw err;
            console.log(chalk.green('Initialized successfully.'));
            rl.close()
        });
    }
    rl.question("Need authentication? (y/n): ", function(auth) {
        project.auth = auth === 'y';
        if (!project.auth) {
            end(project)
            return
        }
        rl.question("Need base user model? (y/n): ", function(ans) {
            if (ans === 'y') {
                project.models = {
                    user: {
                        create: "admin",
                        read: "admin",
                        update: "admin",
                        delete: "admin",
                        fields: {
                            name: {
                                type: "string",
                                required: true,
                                n_update: "admin"
                            },
                            password: {
                                type: "string",
                                required: true,
                                n_update: "admin"
                            },
                            email: {
                                type: "string",
                                required: false,
                                n_update: "admin"
                            },
                        }
                    }
                }
            }
            rl.question("Need roles? (y/n): ", function(ans) {
                if(ans === 'y'){
                    project.roles = {
                        admin: {},
                        user: {},
                        anonymous: {},
                    }
                }
                end(project);
            });
        });
    });
}

const commands = [
    {
        names: ['init', 'i'],
        fun: init,
        desc: "command for initialization in new project"
    }, {
        names: ['help', 'h'],
        fun: help_m,
        desc: "displaying this message"
    }, {
        names: ['generate', 'gen', 'g'],
        fun: generate,
        desc: "generating api from config file"
    },
]

const run = args => {
    if (args.length === 0){
        console.log(chalk.green("Hello from GPIN"))
        return
    }
    for (let i = 0; i < commands.length; i++) {
        let command = commands[i]
        for (let j = 0; j < command.names.length; j++) {
            if (command.names[j] === args[0]) {
                command.fun(args)
                return
            }
        }
    }
    error_m()

}
run(args)