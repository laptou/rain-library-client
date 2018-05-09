clear-host
& webpack --config webpack.prod.js
write-output "Build completed, beginning copy"
& robocopy ./ "\\192.168.2.202\ibiyemi.intulon.com\client" webpack.*.js config.js
& robocopy ./dist "\\192.168.2.202\ibiyemi.intulon.com\client\dist" /mir
write-output "Copy completed"