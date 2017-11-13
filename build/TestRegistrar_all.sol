
//File: contracts/AbstractENS.sol
pragma solidity ^0.4.0;

contract AbstractENS {
    function owner(bytes32 node) constant returns(address);
    function resolver(bytes32 node) constant returns(address);
    function ttl(bytes32 node) constant returns(uint64);
    function setOwner(bytes32 node, address owner);
    function setSubnodeOwner(bytes32 node, bytes32 label, address owner);
    function setResolver(bytes32 node, address resolver);
    function setTTL(bytes32 node, uint64 ttl);

    // Logged when the owner of a node assigns a new owner to a subnode.
    event NewOwner(bytes32 indexed node, bytes32 indexed label, address owner);

    // Logged when the owner of a node transfers ownership to a new account.
    event Transfer(bytes32 indexed node, address owner);

    // Logged when the resolver for a node changes.
    event NewResolver(bytes32 indexed node, address resolver);

    // Logged when the TTL of a node changes
    event NewTTL(bytes32 indexed node, uint64 ttl);
}

//File: ./contracts/TestRegistrar.sol
pragma solidity ^0.4.0;



/**
 * A registrar that allocates subdomains to the first person to claim them, but
 * expires registrations a fixed period after they're initially claimed.
 */
contract TestRegistrar {
    uint constant registrationPeriod = 4 weeks;

    AbstractENS public ens;
    bytes32 public rootNode;
    mapping(bytes32=>uint) public expiryTimes;

    /**
     * Constructor.
     * @param ensAddr The address of the ENS registry.
     * @param node The node that this registrar administers.
     */
    function TestRegistrar(AbstractENS ensAddr, bytes32 node) {
        ens = ensAddr;
        rootNode = node;
    }

    /**
     * Register a name that's not currently registered
     * @param subnode The hash of the label to register.
     * @param owner The address of the new owner.
     */
    function register(bytes32 subnode, address owner) {
        if (expiryTimes[subnode] >= now) throw;

        expiryTimes[subnode] = now + registrationPeriod;
        ens.setSubnodeOwner(rootNode, subnode, owner);
    }
}
