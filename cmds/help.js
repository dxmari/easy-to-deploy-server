const menus = {
      main: `
            edeploy [command] <options>
      
            edeploy start [name].......... to start the application
                  --host .......... the host name to run the application
                  --port .......... the port number to run the application

            edeploy restart [app name or id].......... to restart the application
                  --host .......... the host name to run the application
                  --port .......... the port number to run the application

            edeploy show [command or [app name or id]].......... to show the application info
                  --all .......... to show list of all applications

            edeploy stop [app name or id].......... to stop the application
            edeploy delete [app name or id].......... to delete the application
            version ........... show package version
            help .............. show help menu for a command`,

      start: `
            edeploy start [name].......... to start the application
                  --host .......... the host name to run the application
                  --port .......... the port number to run the application
                  `,
      restart: `
            edeploy restart [name].......... to start the application
                  --host .......... the host name to run the application
                  --port .......... the port number to run the application
                  `,
      show: `
            edeploy show [command or [app name or id]].......... to show the application info
            --all .......... to show list of all applications`,

      config: `
            edeploy config [name].......... to change the configuration of the application
                  --script .......... script which is run during the deployment.
                  `,
      stop: `
            edeploy stop [app name or id].......... to stop the application
      `,
      delete: `
            edeploy delete [app name or id].......... to delete the application
      `,
}


module.exports = (args) => {
      const subCmd = args._[0] === 'help'
            ? args._[1]
            : args._[0]

      console.log(menus[subCmd] || menus.main)
}