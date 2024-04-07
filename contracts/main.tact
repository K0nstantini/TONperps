import "@stdlib/ownable";
import "@stdlib/deploy";
import "./imports/trustable.tact";

struct BaseJetton {
    addr: Address;
    decimal: Int as int8;
}

struct Jetton {
    decimal: Int as int8;
    active: Bool;
}

message SetBaseJetton {
    addr: Address;
    decimal: Int as int8;
}

message AddJetton {
    addr: Address;
    decimal: Int as int8;
    active: Bool;
}

message RemoveJetton {
    addr: Address;
}

contract Main with Deployable, OwnableTransferable, Trustable {
    owner: Address;
    trustedAddresses: map<Address, Bool>;
    baseJetton: BaseJetton?;
    jettons: map<Address, Jetton>;

    init() {
        self.owner = sender();
    }

    receive(msg: SetBaseJetton) {
        self.requireOwner();
        require(self.baseJetton == null, "The base Jetton is already set");
        self.baseJetton = BaseJetton {
            addr: msg.addr,
            decimal: msg.decimal
            };
    }

    receive(msg: AddJetton) {
        self.requireOwner();
        self.jettons.set(msg.addr, Jetton {
            decimal: msg.decimal,
            active: msg.active
            });
    }

    receive(msg: RemoveJetton) {
        self.requireOwner();
        self.jettons.set(msg.addr, null);
    }

    get fun get_base_jetton(): BaseJetton? {
        return self.baseJetton;
    }

    get fun get_jettons(): map<Address, Jetton> {
        return self.jettons;
    }

}
