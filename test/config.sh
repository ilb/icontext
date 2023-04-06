#
export DEBUG=node_context
LDAPPREFIX=com.iconicompany CONTEXT_WEBXML=../test/web.xml CONTEXT_CONTEXTXML=../test/context.xml LDAPURI='ldap://localhost:1389/dc=iconicompany,dc=com' node ../src/config.js
