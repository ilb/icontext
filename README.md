#

## upgrade from @ilb/node_context:
```
npm uninstall @ilb/node_context @ilb/node_ldap
npm install icontext
grep -Rl @ilb/node_context src|xargs sed -i 's^@ilb/node_context^icontext^'
```